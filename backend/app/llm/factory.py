import logging
from app.llm.base import BaseLLMProvider
from app.llm.demo_provider import DemoLLMProvider
from app.llm.gemini_provider import GeminiLLMProvider

logger = logging.getLogger(__name__)

class LLMProviderFactory:
    @staticmethod
    def create(provider_name: str = "gemini") -> BaseLLMProvider:
        provider = (provider_name or "").lower().strip()
        if provider == "demo":
            logger.info("Using DemoLLMProvider.")
            return DemoLLMProvider()
        elif provider == "gemini":
            logger.info("Using GeminiLLMProvider.")
            return GeminiLLMProvider()
        else:
            logger.warning(f"Unknown LLM provider '{provider_name}'. Defaulting to GeminiLLMProvider.")
            return GeminiLLMProvider()
