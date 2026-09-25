import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, delete

from app.api.schemas.conversations import (
    ConversationResponse,
    ConversationsListResponse,
    CreateConversationRequest,
    UpdateConversationRequest
)
from app.api.schemas.chat import MessageResponse, GroundedAnswerResponse, QueryAnalysisResponse
from app.models.conversation import Conversation, Message
from app.dependencies import get_db
from app.core.exceptions import NotFoundError

router = APIRouter()

@router.get("", response_model=ConversationsListResponse)
async def list_conversations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * page_size
    
    # Total count
    count_stmt = select(func.count(Conversation.id))
    count_res = await db.execute(count_stmt)
    total = count_res.scalar_one()

    # List conversations ordered by updated_at descending
    stmt = (
        select(Conversation)
        .order_by(desc(Conversation.updated_at))
        .offset(offset)
        .limit(page_size)
    )
    res = await db.execute(stmt)
    conversations = res.scalars().all()

    items = []
    for conv in conversations:
        # Count messages and get last message preview
        msg_stmt = (
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(desc(Message.created_at))
        )
        msg_res = await db.execute(msg_stmt)
        messages = msg_res.scalars().all()
        msg_count = len(messages)
        last_preview = messages[0].content[:120] if messages else None

        items.append(ConversationResponse(
            id=conv.id,
            title=conv.title or "Untitled Conversation",
            language="en",
            messageCount=msg_count,
            lastMessagePreview=last_preview,
            isArchived=False,
            createdAt=conv.created_at.isoformat() if conv.created_at else datetime.now(timezone.utc).isoformat(),
            updatedAt=conv.updated_at.isoformat() if conv.updated_at else datetime.now(timezone.utc).isoformat()
        ))

    has_more = (offset + len(items)) < total

    return ConversationsListResponse(
        items=items,
        page=page,
        pageSize=page_size,
        total=total,
        hasMore=has_more
    )

@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    req: CreateConversationRequest,
    db: AsyncSession = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    conv_id = str(uuid.uuid4())
    conv = Conversation(
        id=conv_id,
        title=req.title or "New Conversation",
        created_at=now,
        updated_at=now
    )
    db.add(conv)
    await db.commit()
    await db.refresh(conv)

    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        language=req.language or "en",
        messageCount=0,
        lastMessagePreview=None,
        isArchived=False,
        createdAt=conv.created_at.isoformat(),
        updatedAt=conv.updated_at.isoformat()
    )

@router.get("/{id}", response_model=ConversationResponse)
async def get_conversation(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Conversation).where(Conversation.id == id)
    res = await db.execute(stmt)
    conv = res.scalar_one_or_none()
    if not conv:
        raise NotFoundError("Conversation not found")

    msg_stmt = (
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(desc(Message.created_at))
    )
    msg_res = await db.execute(msg_stmt)
    messages = msg_res.scalars().all()
    msg_count = len(messages)
    last_preview = messages[0].content[:120] if messages else None

    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        language="en",
        messageCount=msg_count,
        lastMessagePreview=last_preview,
        isArchived=False,
        createdAt=conv.created_at.isoformat() if conv.created_at else datetime.now(timezone.utc).isoformat(),
        updatedAt=conv.updated_at.isoformat() if conv.updated_at else datetime.now(timezone.utc).isoformat()
    )

@router.put("/{id}", response_model=ConversationResponse)
async def update_conversation(
    id: str,
    req: UpdateConversationRequest,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Conversation).where(Conversation.id == id)
    res = await db.execute(stmt)
    conv = res.scalar_one_or_none()
    if not conv:
        raise NotFoundError("Conversation not found")

    conv.title = req.title
    conv.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(conv)

    msg_stmt = (
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(desc(Message.created_at))
    )
    msg_res = await db.execute(msg_stmt)
    messages = msg_res.scalars().all()

    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        language="en",
        messageCount=len(messages),
        lastMessagePreview=messages[0].content[:120] if messages else None,
        isArchived=False,
        createdAt=conv.created_at.isoformat() if conv.created_at else datetime.now(timezone.utc).isoformat(),
        updatedAt=conv.updated_at.isoformat() if conv.updated_at else datetime.now(timezone.utc).isoformat()
    )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    # Delete messages first
    await db.execute(delete(Message).where(Message.conversation_id == id))
    # Delete conversation
    await db.execute(delete(Conversation).where(Conversation.id == id))
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{id}/messages")
async def get_conversation_messages(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Message)
        .where(Message.conversation_id == id)
        .order_by(Message.created_at.asc())
    )
    res = await db.execute(stmt)
    messages = res.scalars().all()
    
    return [
        {
            "id": m.id,
            "conversationId": m.conversation_id,
            "role": m.role,
            "content": m.content,
            "status": "complete",
            "language": "en",
            "createdAt": m.created_at.isoformat() if m.created_at else datetime.now(timezone.utc).isoformat(),
            "answer": m.metadata_ if m.role == "assistant" else None
        }
        for m in messages
    ]
