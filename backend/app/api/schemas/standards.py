from typing import List, Optional
from pydantic import Field
from app.api.schemas.common import CamelModel, PaginatedResponse

class StandardReferenceResponse(CamelModel):
    id: str
    standard_number: str
    title: str
    status: str = "active" # 'active' | 'reaffirmed' | 'superseded' | 'withdrawn' | 'draft' | 'unknown'

class StandardClauseResponse(CamelModel):
    id: str
    number: str
    title: str
    text: Optional[str] = None
    page: Optional[int] = None
    children: Optional[List["StandardClauseResponse"]] = None

class RelatedStandardResponse(StandardReferenceResponse):
    relationship: str = "references" # 'references' | 'referenced_by' | 'supersedes' | 'superseded_by' | 'amendment' | 'part_of' | 'similar'
    note: Optional[str] = None

class CertificationRelevanceResponse(CamelModel):
    is_certifiable: bool = True
    scheme_ids: List[str] = Field(default_factory=lambda: ["isi-mark"])
    is_mandatory: Optional[bool] = False
    notes: Optional[str] = None

class StandardResponse(StandardReferenceResponse):
    year: Optional[int] = None
    reaffirmed_year: Optional[int] = None
    revision: Optional[str] = None
    description: Optional[str] = None
    scope: Optional[str] = None
    sectors: List[str] = Field(default_factory=lambda: ["Civil Engineering", "Construction"])
    categories: List[str] = Field(default_factory=lambda: ["Building Code", "Structural"])
    ics_code: Optional[str] = "91.100.30"
    language: str = "en"
    page_count: Optional[int] = 50
    clauses: List[StandardClauseResponse] = Field(default_factory=list)
    related_standards: List[RelatedStandardResponse] = Field(default_factory=list)
    certification_relevance: Optional[CertificationRelevanceResponse] = None
    source_document_id: Optional[str] = None
    official_url: Optional[str] = "https://standardsbis.bsbedge.com"
    is_full_text_available: bool = True
    is_demo: bool = False
    # Additional backend metadata
    department: Optional[str] = None
    committee: Optional[str] = None
    abstract: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)

class StandardListResponse(PaginatedResponse[StandardResponse]):
    pass
