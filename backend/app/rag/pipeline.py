from typing import Optional
from app.api.schemas.chat import ChatResponse, MessageResponse, GroundedAnswerResponse, QueryAnalysisResponse
from app.rag.query_understanding import QueryUnderstanding
from app.rag.grounding import GroundingChecker
import uuid
from datetime import datetime
from app.core.exceptions import InsufficientEvidenceError

class RAGPipeline:
    def __init__(self, llm, retriever, settings):
        self.llm = llm
        self.retriever = retriever
        self.settings = settings
        self.qu = QueryUnderstanding()
        self.gc = GroundingChecker()

    async def process_query(self, query: str, conversation_id: Optional[str] = None, language: str = "en") -> ChatResponse:
        analysis = self.qu.analyze_query(query, language)
        
        evidence = self.retriever.retrieve(query, analysis['entities'])
        
        if not evidence or len(evidence) == 0:
            return ChatResponse(
                message=MessageResponse(
                    id=str(uuid.uuid4()),
                    role="assistant",
                    content="I couldn't find enough information to answer your question.",
                    created_at=datetime.utcnow().isoformat()
                ),
                grounding=GroundedAnswerResponse(
                    answer="",
                    evidence=[],
                    status="insufficient_evidence"
                ),
                analysis=QueryAnalysisResponse(**analysis)
            )

        answer = self.llm.generate(query, evidence, language)
        
        return ChatResponse(
            message=MessageResponse(
                id=str(uuid.uuid4()),
                role="assistant",
                content=answer,
                created_at=datetime.utcnow().isoformat()
            ),
            grounding=GroundedAnswerResponse(
                answer=answer,
                evidence=evidence,
                status="success"
            ),
            analysis=QueryAnalysisResponse(**analysis)
        )
