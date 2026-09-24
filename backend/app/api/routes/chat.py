from fastapi import APIRouter, Depends
from app.api.schemas.chat import ChatRequest, ChatResponse
from app.dependencies import get_rag_service
from app.rag.pipeline import RAGPipeline
import uuid
from datetime import datetime

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, rag_service: RAGPipeline = Depends(get_rag_service)):
    result = await rag_service.process_query(
        query=request.query,
        conversation_id=request.conversation_id,
        language=request.language
    )
    return result
