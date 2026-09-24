from fastapi import APIRouter
from app.api.schemas.feedback import FeedbackRequest, FeedbackResponse

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(req: FeedbackRequest):
    return FeedbackResponse(id=1, status="success")
