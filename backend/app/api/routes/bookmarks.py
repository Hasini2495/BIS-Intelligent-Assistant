import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import get_optional_user
from app.models.user import User
from app.models.bookmark import Bookmark
from app.api.schemas.bookmarks import BookmarkCreateRequest, BookmarkResponse

router = APIRouter()

INITIAL_BOOKMARKS = [
    {
        "id": "b-1",
        "user_id": "usr_default",
        "item_id": "std-1",
        "item_type": "standard",
        "title": "IS 456:2000",
        "subtitle": "Plain and Reinforced Concrete — Code of Practice",
        "link": "/standards/std-1",
        "reference_number": "IS 456:2000"
    },
    {
        "id": "b-2",
        "user_id": "usr_default",
        "item_id": "led_test",
        "item_type": "answer",
        "title": "What are the tests for LED bulb?",
        "subtitle": "AI Assistant Answer with citations to IS 16102 and CRS rules",
        "link": "/assistant?q=Which%20standard%20applies%20for%20LED%20bulb%3F",
        "reference_number": "IS 16102"
    },
    {
        "id": "b-3",
        "user_id": "usr_default",
        "item_id": "doc-1",
        "item_type": "document",
        "title": "LED_Bulb_TestReport.pdf",
        "subtitle": "NABL Accredited Testing Report (Photometric & Electrical)",
        "link": "/documents",
        "reference_number": "DOC-1"
    },
    {
        "id": "b-4",
        "user_id": "usr_default",
        "item_id": "val-1",
        "item_type": "report",
        "title": "Validation Report — LED Bulb (9W)",
        "subtitle": "Mostly Compliant (7 of 10 requirements satisfied)",
        "link": "/compliance/result",
        "reference_number": "REPORT-9W"
    },
    {
        "id": "b-5",
        "user_id": "usr_default",
        "item_id": "std-2",
        "item_type": "standard",
        "title": "IS 302 (Part 1):2008",
        "subtitle": "Safety of Household and Similar Electrical Appliances",
        "link": "/standards/std-2",
        "reference_number": "IS 302-1"
    }
]


async def _ensure_default_user_and_bookmarks(db: AsyncSession, user_id: str):
    # Ensure default user exists if referenced
    if user_id == "usr_default":
        u_res = await db.execute(select(User).where(User.id == "usr_default"))
        if not u_res.scalar_one_or_none():
            db.add(User(
                id="usr_default",
                name="Pavan",
                email="pavan@example.com",
                hashed_password="mock_hashed_password",
                role="user",
                is_active=True
            ))
            await db.commit()

    b_res = await db.execute(select(Bookmark).where(Bookmark.user_id == user_id).limit(1))
    if b_res.scalar_one_or_none() is None and user_id == "usr_default":
        for b in INITIAL_BOOKMARKS:
            db.add(Bookmark(
                id=b["id"],
                user_id=user_id,
                item_id=b["item_id"],
                item_type=b["item_type"],
                title=b["title"],
                subtitle=b["subtitle"],
                link=b["link"],
                reference_number=b["reference_number"]
            ))
        await db.commit()


@router.get("", response_model=List[BookmarkResponse])
async def list_bookmarks(
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_session)
):
    target_user_id = current_user.id if current_user else "usr_default"
    await _ensure_default_user_and_bookmarks(db, target_user_id)

    res = await db.execute(
        select(Bookmark).where(Bookmark.user_id == target_user_id).order_by(Bookmark.created_at.desc())
    )
    bms = res.scalars().all()

    return [
        BookmarkResponse(
            id=b.id,
            type=b.item_type,
            title=b.title,
            subtitle=b.subtitle,
            saved_on=f"Saved on {b.created_at.strftime('%d %b %Y')}" if b.created_at else "Recently",
            link=b.link,
            item_id=b.item_id,
            reference_number=b.reference_number
        )
        for b in bms
    ]


@router.post("", response_model=BookmarkResponse)
async def create_bookmark(
    req: BookmarkCreateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_session)
):
    target_user_id = current_user.id if current_user else "usr_default"
    await _ensure_default_user_and_bookmarks(db, target_user_id)

    # Check if already bookmarked
    existing = await db.execute(
        select(Bookmark).where(Bookmark.user_id == target_user_id, Bookmark.item_id == req.item_id)
    )
    b = existing.scalar_one_or_none()
    if b:
        return BookmarkResponse(
            id=b.id,
            type=b.item_type,
            title=b.title,
            subtitle=b.subtitle,
            saved_on=f"Saved on {b.created_at.strftime('%d %b %Y')}" if b.created_at else "Recently",
            link=b.link,
            item_id=b.item_id,
            reference_number=b.reference_number
        )

    b_id = f"bm_{uuid.uuid4().hex[:10]}"
    new_b = Bookmark(
        id=b_id,
        user_id=target_user_id,
        item_id=req.item_id,
        item_type=req.item_type,
        title=req.title,
        subtitle=req.subtitle,
        link=req.link,
        reference_number=req.reference_number
    )
    db.add(new_b)
    await db.commit()
    await db.refresh(new_b)

    return BookmarkResponse(
        id=new_b.id,
        type=new_b.item_type,
        title=new_b.title,
        subtitle=new_b.subtitle,
        saved_on="Saved just now",
        link=new_b.link,
        item_id=new_b.item_id,
        reference_number=new_b.reference_number
    )


@router.delete("/{id}")
async def delete_bookmark(
    id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_session)
):
    target_user_id = current_user.id if current_user else "usr_default"
    res = await db.execute(
        select(Bookmark).where(Bookmark.id == id, Bookmark.user_id == target_user_id)
    )
    b = res.scalar_one_or_none()
    if b:
        await db.delete(b)
        await db.commit()
        return {"message": "Bookmark removed."}
    
    return {"message": "Bookmark not found or already deleted."}
