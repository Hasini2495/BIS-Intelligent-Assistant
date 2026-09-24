from fastapi import APIRouter
from typing import List
from app.api.schemas.conversations import ConversationResponse, ConversationListResponse, CreateConversationRequest
import uuid
from datetime import datetime

router = APIRouter()
demo_conversations = []

@router.get("", response_model=ConversationListResponse)
async def list_conversations():
    return ConversationListResponse(items=demo_conversations, total=len(demo_conversations))

@router.post("", response_model=ConversationResponse)
async def create_conversation(req: CreateConversationRequest):
    conv = ConversationResponse(
        id=str(uuid.uuid4()),
        title=req.title,
        created_at=datetime.utcnow().isoformat(),
        messages=[]
    )
    demo_conversations.append(conv)
    return conv

@router.get("/{id}", response_model=ConversationResponse)
async def get_conversation(id: str):
    for c in demo_conversations:
        if c.id == id:
            return c
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Conversation not found")

@router.delete("/{id}")
async def delete_conversation(id: str):
    global demo_conversations
    demo_conversations = [c for c in demo_conversations if c.id != id]
    return {"status": "deleted"}

@router.patch("/{id}")
async def update_conversation(id: str, title: str):
    for c in demo_conversations:
        if c.id == id:
            c.title = title
            return c
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Conversation not found")
