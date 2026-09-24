from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    language: str = "en"

class EvidenceSnippetResponse(BaseModel):
    source_id: str
    title: str
    content: str
    relevance_score: float

class QueryAnalysisResponse(BaseModel):
    intent: str
    entities: List[str]
    detected_language: str

class SourceResponse(BaseModel):
    id: str
    title: str
    url: Optional[str] = None

class GroundedAnswerResponse(BaseModel):
    answer: str
    evidence: List[EvidenceSnippetResponse]
    status: str = "success"

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str
    metadata: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message: MessageResponse
    grounding: Optional[GroundedAnswerResponse] = None
    analysis: Optional[QueryAnalysisResponse] = None
