import time
import uuid
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api.schemas.chat import (
    ChatResponse,
    MessageResponse,
    GroundedAnswerResponse,
    QueryAnalysisResponse,
    InsufficientEvidenceResponse
)
from app.rag.query_understanding import QueryUnderstanding
from app.rag.grounding import GroundingChecker
from app.models.conversation import Conversation, Message

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self, llm, retriever, settings):
        self.llm = llm
        self.retriever = retriever
        self.settings = settings
        self.qu = QueryUnderstanding()
        self.gc = GroundingChecker()

    async def _get_history(self, db: Optional[AsyncSession], conversation_id: str) -> List[Dict[str, str]]:
        if not db or not conversation_id:
            return []
        try:
            stmt = (
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at.asc())
            )
            result = await db.execute(stmt)
            messages = result.scalars().all()
            return [{"role": m.role, "content": m.content} for m in messages]
        except Exception as e:
            logger.warning(f"Failed to fetch conversation history: {e}")
            return []

    async def _persist_turn(
        self,
        db: Optional[AsyncSession],
        conversation_id: str,
        conversation_title: str,
        user_query: str,
        assistant_message: MessageResponse,
        grounded_answer: GroundedAnswerResponse
    ):
        if not db:
            return
        try:
            stmt = select(Conversation).where(Conversation.id == conversation_id)
            res = await db.execute(stmt)
            conv = res.scalar_one_or_none()

            now = datetime.now(timezone.utc)
            if not conv:
                conv = Conversation(
                    id=conversation_id,
                    title=conversation_title,
                    created_at=now,
                    updated_at=now
                )
                db.add(conv)
            else:
                conv.updated_at = now

            user_msg = Message(
                id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                role="user",
                content=user_query,
                created_at=now
            )
            db.add(user_msg)

            assistant_msg = Message(
                id=assistant_message.id,
                conversation_id=conversation_id,
                role="assistant",
                content=assistant_message.content,
                created_at=now,
                metadata_=grounded_answer.model_dump(by_alias=True)
            )
            db.add(assistant_msg)

            await db.commit()
        except Exception as e:
            logger.error(f"Failed to persist chat turn to database: {e}")
            await db.rollback()

    def _generate_related_questions(self, query: str, standards: List[Any], entities: List[Any]) -> List[str]:
        questions = []
        for std in standards[:2]:
            std_num = getattr(std, "standard_number", getattr(std, "standardNumber", ""))
            if std_num:
                questions.append(f"What are the mandatory testing requirements under {std_num}?")
                questions.append(f"Which certification scheme applies to {std_num}?")

        for ent in entities[:2]:
            val = getattr(ent, "value", "")
            if val and val.lower() not in ["bis", "is"]:
                questions.append(f"How can I obtain an ISI mark for {val}?")

        if not questions:
            questions = [
                "What is the difference between ISI Mark Scheme I and CRS Scheme II?",
                "How can I verify a standard or license on Manakonline?",
                "Which laboratories are recognized by BIS for electrical safety testing?"
            ]
        return list(dict.fromkeys(questions))[:4]

    async def process_query(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        language: str = "en",
        db: Optional[AsyncSession] = None
    ) -> ChatResponse:
        total_start = time.perf_counter()
        active_conversation_id = conversation_id or str(uuid.uuid4())

        # 1. Fetch conversation history for follow-up resolution
        history = await self._get_history(db, active_conversation_id)

        # 2. Query Understanding (with context resolution and language detection)
        analysis = self.qu.analyze_query(query, language=language, history=history)
        effective_query = analysis.rewritten_query or query
        effective_language = analysis.detected_language or language or "en"

        # 3. Retrieval & Ranking on resolved query
        retrieval_start = time.perf_counter()
        evidence, sources, standards = self.retriever.retrieve_with_context(effective_query, top_k=5)
        retrieval_latency_ms = (time.perf_counter() - retrieval_start) * 1000.0

        # 4. Grounding Verification
        status, insufficient_evidence = self.gc.check_grounding(effective_query, evidence)

        # 5. LLM Answer Generation
        model_name = getattr(self.settings, "LLM_PROVIDER", "gemini").lower()
        if status == "insufficient_evidence":
            answer_text = (
                "### Bureau of Indian Standards — Notice\n\n"
                "Official BIS documentation indexed in the current knowledge base does not provide sufficient detail "
                f"to answer your question regarding **\"{query}\"** with verified technical precision.\n\n"
                "**Recommended Action:**\n"
                "- Verify the standard designation or title on the official [Manakonline Portal](https://www.manakonline.in).\n"
                "- Use the **Know Your Standards** service at standardsbis.bsbedge.com.\n"
                "- Consult the nearest BIS Regional or Branch Office for gazetted directives."
            )
        else:
            try:
                answer_text = self.llm.generate(
                    prompt=effective_query,
                    context=evidence,
                    language=effective_language,
                    history=history
                )
            except Exception as e:
                logger.warning(f"Error invoking primary LLM provider '{model_name}': {e}. Falling back to BIS deterministic generator.")
                from app.llm.demo_provider import DemoLLMProvider
                fallback_provider = DemoLLMProvider()
                answer_text = fallback_provider.generate(
                    prompt=effective_query,
                    context=evidence,
                    language=effective_language,
                    history=history
                )

        # 6. Related Questions & Latency
        related_questions = self._generate_related_questions(effective_query, standards, analysis.entities)
        total_latency_ms = (time.perf_counter() - total_start) * 1000.0

        model_label = "Google Gemini 2.5 Flash" if "gemini" in model_name else "BIS Local Engine"

        # 7. Build Grounded Answer Response
        grounded_answer = GroundedAnswerResponse(
            status=status,
            answerMarkdown=answer_text,
            summary=f"Official technical response regarding {query[:60]}",
            relevantStandards=standards,
            whyRelevant=f"Identified {len(standards)} relevant standard(s) based on keyword and clause analysis.",
            evidence=evidence,
            sources=sources,
            relatedQuestions=related_questions,
            insufficientEvidence=insufficient_evidence,
            disclaimerKeys=["disclaimers.official_source_check", "disclaimers.advisory_only"],
            generatedAt=datetime.now(timezone.utc).isoformat(),
            modelLabel=model_label,
            retrievalLatencyMs=round(retrieval_latency_ms, 2),
            totalLatencyMs=round(total_latency_ms, 2),
            isDemoData=False
        )

        # 8. Build Assistant Message
        assistant_message_id = str(uuid.uuid4())
        message_response = MessageResponse(
            id=assistant_message_id,
            conversationId=active_conversation_id,
            role="assistant",
            content=answer_text,
            status="complete",
            language=effective_language,
            createdAt=datetime.now(timezone.utc).isoformat(),
            analysis=analysis,
            answer=grounded_answer
        )

        # Generate conversation title
        first_std = standards[0].standard_number if standards else None
        first_entity = analysis.entities[0].value if analysis.entities else None
        if first_std:
            conversation_title = f"{first_std} Query"
        elif first_entity:
            conversation_title = f"{first_entity.title()} Advisory"
        else:
            conversation_title = query[:30].strip() + ("..." if len(query) > 30 else "")

        # 9. Persist Turn to Database
        if db:
            await self._persist_turn(
                db=db,
                conversation_id=active_conversation_id,
                conversation_title=conversation_title,
                user_query=query,
                assistant_message=message_response,
                grounded_answer=grounded_answer
            )

        return ChatResponse(
            message=message_response,
            conversationId=active_conversation_id,
            conversationTitle=conversation_title
        )
