from typing import List, Optional
from app.api.schemas.common import CamelModel

class SourceResponse(CamelModel):
    id: str
    citation_index: int = 1
    title: str
    document_id: str
    document_name: str
    source_type: str = "indian_standard" # 'indian_standard' | 'scheme_document' | 'guideline' | 'faq' | 'circular' | 'web_page' | 'demo_dataset'
    standard_number: Optional[str] = None
    section: Optional[str] = None
    clause: Optional[str] = None
    page: Optional[int] = None
    version: Optional[str] = None
    authority: str = "Bureau of Indian Standards"
    publication_date: Optional[str] = None
    last_indexed_at: Optional[str] = None
    url: Optional[str] = None
    is_official: bool = True
    is_demo: bool = False
    relevance: str = "high" # 'high' | 'medium' | 'low'
    relevance_score: Optional[float] = 0.95
    excerpt: Optional[str] = None

class DocumentSectionResponse(CamelModel):
    id: str
    number: str
    title: str
    content: Optional[str] = None
    page: Optional[int] = None

class DocumentResponse(CamelModel):
    id: str
    title: str
    document_type: str = "indian_standard"
    standard_number: Optional[str] = None
    version: Optional[str] = None
    authority: str = "Bureau of Indian Standards"
    publication_date: Optional[str] = None
    last_indexed_at: Optional[str] = None
    index_status: str = "indexed"
    page_count: Optional[int] = None
    section_count: Optional[int] = None
    url: Optional[str] = None
    is_full_text_available: bool = True
    is_demo: bool = False
    sections: Optional[List[DocumentSectionResponse]] = None
