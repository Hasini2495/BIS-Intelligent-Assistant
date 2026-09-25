import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.feedback import FeedbackRequest, FeedbackResponse
from app.models.feedback import Feedback
from app.core.security import get_optional_user
from app.models.user import User
from app.dependencies import get_db

router = APIRouter()


@router.post("", response_model=FeedbackResponse)
async def submit_feedback(
    req: FeedbackRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    rating_val = 1 if req.rating == "helpful" else -1
    fb = Feedback(
        message_id=req.message_id,
        user_id=current_user.id if current_user else None,
        rating=rating_val,
        category="general",
        comment=req.comment,
        status="open"
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)

    return FeedbackResponse(
        id=str(fb.id),
        messageId=req.message_id,
        conversationId=req.conversation_id,
        rating=req.rating,
        reasons=req.reasons or [],
        comment=req.comment,
        submittedAt=datetime.now(timezone.utc).isoformat()
    )


@router.get("")
async def list_feedback(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Feedback)
    if status:
        query = query.where(Feedback.status == status)
    res = await db.execute(query)
    records = res.scalars().all()
    return [
        {
            "id": r.id,
            "messageId": r.message_id,
            "userId": r.user_id,
            "rating": "helpful" if r.rating == 1 else "unhelpful",
            "comment": r.comment,
            "category": r.category,
            "status": r.status,
            "createdAt": r.created_at.isoformat() if r.created_at else None
        }
        for r in records
    ]
