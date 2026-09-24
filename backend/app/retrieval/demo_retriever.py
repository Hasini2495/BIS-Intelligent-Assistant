from app.retrieval.base import BaseRetriever
from typing import List, Dict, Any
from app.utils.demo_data import get_demo_standards
from app.api.schemas.chat import EvidenceSnippetResponse

class DemoRetriever(BaseRetriever):
    def retrieve(self, query: str, filters: List[str] = None) -> List[EvidenceSnippetResponse]:
        evidence = []
        query_lower = query.lower()
        stds = get_demo_standards()
        
        for std in stds:
            if std['standard_number'].lower() in query_lower or query_lower in std['title'].lower() or any(k.lower() in query_lower for k in std.get('keywords', [])):
                evidence.append(EvidenceSnippetResponse(
                    source_id=std['id'],
                    title=f"{std['standard_number']} - {std['title']}",
                    content=std.get('abstract', f"Details for {std['standard_number']}"),
                    relevance_score=0.9
                ))
        return evidence
