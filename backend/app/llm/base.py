from abc import ABC, abstractmethod
from typing import List, Any, Optional, Dict

class BaseLLMProvider(ABC):
    @abstractmethod
    def generate(
        self,
        prompt: str,
        context: List[Any],
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        pass
