from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.api.schemas.chat import MessageResponse

class CreateConversationRequest(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: Optional[str] = None
    messages: List[MessageResponse] = []

class ConversationListResponse(BaseModel):
    items: List[ConversationResponse]
    total: int
