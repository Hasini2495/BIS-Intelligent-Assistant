from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.core.database import get_session
from app.config import get_settings, Settings
from app.llm.factory import LLMProviderFactory
from app.llm.base import BaseLLMProvider
from app.retrieval.demo_retriever import DemoRetriever
from app.rag.pipeline import RAGPipeline

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session

def get_config() -> Settings:
    return get_settings()

def get_llm_service(settings: Settings = Depends(get_config)) -> BaseLLMProvider:
    return LLMProviderFactory.create(settings.LLM_PROVIDER)

def get_retrieval_service(settings: Settings = Depends(get_config)) -> DemoRetriever:
    return DemoRetriever()

def get_rag_service(
    llm: BaseLLMProvider = Depends(get_llm_service),
    retriever: DemoRetriever = Depends(get_retrieval_service),
    settings: Settings = Depends(get_config)
) -> RAGPipeline:
    return RAGPipeline(llm=llm, retriever=retriever, settings=settings)
