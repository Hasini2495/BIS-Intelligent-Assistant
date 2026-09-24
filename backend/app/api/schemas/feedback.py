from pydantic import BaseModel
from typing import Optional

class FeedbackRequest(BaseModel):
    message_id: str
    rating: int
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    status: str = "success"
