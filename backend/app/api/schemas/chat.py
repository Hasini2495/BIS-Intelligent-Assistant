from pydantic import Field, model_validator
from typing import List, Optional
from datetime import datetime, timezone
from app.api.schemas.common import CamelModel
from app.api.schemas.sources import SourceResponse
from app.api.schemas.standards import StandardReferenceResponse

class ChatRequest(CamelModel):
    message: Optional[str] = None
    query: Optional[str] = None
    conversation_id: Optional[str] = Field(default=None, alias="conversationId")
    language: str = "en"

    @model_validator(mode="after")
    def populate_message_or_query(self):
        if not self.message and self.query:
            self.message = self.query
        elif not self.query and self.message:
            self.query = self.message
        if not self.message:
            self.message = ""
        return self

class EvidenceSnippetResponse(CamelModel):
    id: str
    source_id: str = Field(..., alias="sourceId")
    text: str
    standard_number: Optional[str] = Field(default=None, alias="standardNumber")
    section: Optional[str] = None
    clause: Optional[str] = None
    page: Optional[int] = None
    relevance: str = "high"  # 'high', 'medium', 'low'
    citation_index: int = Field(default=1, alias="citationIndex")

class EntityResponse(CamelModel):
    type: str  # 'product', 'material', 'industry', 'standard_number', 'scheme', 'service', 'test', 'laboratory', 'location'
    value: str
    normalized_value: Optional[str] = Field(default=None, alias="normalizedValue")
    confidence: Optional[float] = None

class QueryAnalysisResponse(CamelModel):
    intent: str = "standard_search"
    intent_confidence: Optional[float] = Field(default=0.9, alias="intentConfidence")
    entities: List[EntityResponse] = Field(default_factory=list)
    detected_language: str = Field(default="en", alias="detectedLanguage")
    rewritten_query: Optional[str] = Field(default=None, alias="rewrittenQuery")

class InsufficientEvidenceResponse(CamelModel):
    reason_key: str = Field(default="no_match", alias="reasonKey")  # 'no_match', 'low_relevance', 'out_of_scope', 'not_indexed'
    searched_scopes: List[str] = Field(default_factory=list, alias="searchedScopes")
    suggestions: List[str] = Field(default_factory=list)

class GroundedAnswerResponse(CamelModel):
    status: str = "grounded"  # 'grounded', 'partially_grounded', 'insufficient_evidence'
    answer_markdown: str = Field(..., alias="answerMarkdown")
    summary: Optional[str] = None
    relevant_standards: List[StandardReferenceResponse] = Field(default_factory=list, alias="relevantStandards")
    why_relevant: Optional[str] = Field(default=None, alias="whyRelevant")
    evidence: List[EvidenceSnippetResponse] = Field(default_factory=list)
    sources: List[SourceResponse] = Field(default_factory=list)
    related_questions: List[str] = Field(default_factory=list, alias="relatedQuestions")
    insufficient_evidence: Optional[InsufficientEvidenceResponse] = Field(default=None, alias="insufficientEvidence")
    disclaimer_keys: List[str] = Field(
        default_factory=lambda: ["disclaimers.official_source_check", "disclaimers.advisory_only"],
        alias="disclaimerKeys"
    )
    generated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        alias="generatedAt"
    )
    model_label: Optional[str] = Field(default="Gemini 2.5 Flash", alias="modelLabel")
    retrieval_latency_ms: Optional[float] = Field(default=0.0, alias="retrievalLatencyMs")
    total_latency_ms: Optional[float] = Field(default=0.0, alias="totalLatencyMs")
    is_demo_data: bool = Field(default=False, alias="isDemoData")

class MessageErrorResponse(CamelModel):
    code: str
    message_key: str = Field(..., alias="messageKey")

class MessageResponse(CamelModel):
    id: str
    conversation_id: str = Field(..., alias="conversationId")
    role: str = "assistant"  # 'user', 'assistant', 'system'
    content: str
    status: str = "complete"  # 'pending', 'streaming', 'complete', 'error', 'cancelled'
    language: str = "en"
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        alias="createdAt"
    )
    analysis: Optional[QueryAnalysisResponse] = None
    answer: Optional[GroundedAnswerResponse] = None
    error: Optional[MessageErrorResponse] = None

class ChatResponse(CamelModel):
    message: MessageResponse
    conversation_id: str = Field(..., alias="conversationId")
    conversation_title: str = Field(..., alias="conversationTitle")
