from pydantic import Field
from typing import Optional
from app.api.schemas.common import CamelModel, PaginatedResponse

class CreateConversationRequest(CamelModel):
    title: str = "New Conversation"
    language: Optional[str] = "en"

class UpdateConversationRequest(CamelModel):
    title: str

class ConversationResponse(CamelModel):
    id: str
    title: str
    language: str = "en"
    message_count: int = Field(default=0, alias="messageCount")
    last_message_preview: Optional[str] = Field(default=None, alias="lastMessagePreview")
    is_archived: bool = Field(default=False, alias="isArchived")
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

ConversationsListResponse = PaginatedResponse[ConversationResponse]
