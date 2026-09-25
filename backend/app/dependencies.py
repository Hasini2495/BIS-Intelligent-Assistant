from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.core.database import get_session
from app.config import get_settings, Settings
from app.llm.factory import LLMProviderFactory
from app.llm.base import BaseLLMProvider
from app.retrieval.bis_retriever import BISRetriever
from app.rag.pipeline import RAGPipeline

_retriever_instance = None

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session

def get_config() -> Settings:
    return get_settings()

def get_llm_service(settings: Settings = Depends(get_config)) -> BaseLLMProvider:
    return LLMProviderFactory.create(settings.LLM_PROVIDER)

def get_retrieval_service() -> BISRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = BISRetriever()
    return _retriever_instance

def get_rag_service(
    llm: BaseLLMProvider = Depends(get_llm_service),
    retriever: BISRetriever = Depends(get_retrieval_service),
    settings: Settings = Depends(get_config)
) -> RAGPipeline:
    return RAGPipeline(llm=llm, retriever=retriever, settings=settings)
