from app.llm.base import BaseLLMProvider
from app.llm.demo_provider import DemoLLMProvider

class LLMProviderFactory:
    @staticmethod
    def create(provider_name: str) -> BaseLLMProvider:
        if provider_name.lower() == "demo":
            return DemoLLMProvider()
        # Add other providers (gemini, sarvam) here later
        return DemoLLMProvider()
