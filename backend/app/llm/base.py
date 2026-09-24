from abc import ABC, abstractmethod
from typing import List, Any

class BaseLLMProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, context: List[Any], language: str) -> str:
        pass
