from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.schemas.chat import ChatRequest, ChatResponse
from app.dependencies import get_rag_service, get_db
from app.rag.pipeline import RAGPipeline

router = APIRouter()

@router.post("", response_model=ChatResponse, response_model_exclude_none=True)
async def chat_endpoint(
    request: ChatRequest,
    rag_service: RAGPipeline = Depends(get_rag_service),
    db: AsyncSession = Depends(get_db)
):
    query_text = request.message or request.query or ""
    result = await rag_service.process_query(
        query=query_text,
        conversation_id=request.conversation_id,
        language=request.language,
        db=db
    )
    return result
