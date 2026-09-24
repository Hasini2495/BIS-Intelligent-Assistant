from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseRetriever(ABC):
    @abstractmethod
    def retrieve(self, query: str, filters: List[str] = None) -> List[Any]:
        pass
