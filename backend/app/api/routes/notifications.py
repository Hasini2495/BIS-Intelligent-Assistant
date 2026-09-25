import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import get_optional_user
from app.models.user import User
from app.models.notification import Notification
from app.api.schemas.notifications import NotificationResponse

router = APIRouter()

INITIAL_NOTICES = [
    {
        "id": "n-1",
        "category": "system",
        "title": "New revision of IS 875 published",
        "description": "Design loads code updated with revised unit weights for modern composite structures.",
        "link": "/standards/std-4",
        "read": False
    },
    {
        "id": "n-2",
        "category": "validation",
        "title": "Your validation report is ready",
        "description": "Automated audit for LED Bulb (9W) under IS 16102 (Part 1) finished with 7/10 satisfied.",
        "link": "/compliance/result",
        "read": False
    },
    {
        "id": "n-3",
        "category": "standards",
        "title": "New standard added: IS 19030",
        "description": "Electric Vehicle battery swapping systems safety requirements now indexed in catalogue.",
        "link": "/standards",
        "read": False
    },
    {
        "id": "n-4",
        "category": "system",
        "title": "Scheduled maintenance on Sunday",
        "description": "Manakonline gateway upgrade from 02:00 AM to 05:00 AM IST for enhanced performance.",
        "link": None,
        "read": True
    },
    {
        "id": "n-5",
        "category": "updates",
        "title": "Mandatory Hallmarking Phase-IV Circular",
        "description": "18 additional districts notified under compulsory gold hallmarking scheme.",
        "link": None,
        "read": False
    }
]


async def _ensure_seeded_notifications(db: AsyncSession):
    res = await db.execute(select(Notification).limit(1))
    if res.scalar_one_or_none() is None:
        for n in INITIAL_NOTICES:
            db.add(Notification(
                id=n["id"],
                category=n["category"],
                title=n["title"],
                description=n["description"],
                link=n["link"],
                read=n["read"]
            ))
        await db.commit()


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_session)
):
    await _ensure_seeded_notifications(db)
    
    query = select(Notification).order_by(Notification.created_at.desc())
    res = await db.execute(query)
    notices = res.scalars().all()

    return [
        NotificationResponse(
            id=n.id,
            category=n.category,
            title=n.title,
            description=n.description,
            timestamp=n.created_at.strftime("%d %b %Y") if n.created_at else "Recently",
            read=bool(n.read),
            link=n.link
        )
        for n in notices
    ]


@router.patch("/{id}/read")
async def mark_notification_read(id: str, db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(Notification).where(Notification.id == id))
    n = res.scalar_one_or_none()
    if n:
        n.read = True
        await db.commit()
    return {"message": "Notification marked as read."}


@router.post("/read-all")
async def mark_all_notifications_read(db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(Notification).where(Notification.read == False))
    notices = res.scalars().all()
    for n in notices:
        n.read = True
    await db.commit()
    return {"message": "All notifications marked as read."}
