from pydantic import Field
from typing import List, Optional
from datetime import datetime, timezone
from app.api.schemas.common import CamelModel

class FeedbackRequest(CamelModel):
    message_id: str = Field(..., alias="messageId")
    conversation_id: str = Field(..., alias="conversationId")
    rating: str  # 'helpful', 'not_helpful'
    reasons: Optional[List[str]] = Field(default_factory=list)
    comment: Optional[str] = None

class FeedbackResponse(CamelModel):
    id: Optional[str] = None
    message_id: str = Field(..., alias="messageId")
    conversation_id: str = Field(..., alias="conversationId")
    rating: str
    reasons: Optional[List[str]] = Field(default_factory=list)
    comment: Optional[str] = None
    submitted_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        alias="submittedAt"
    )
