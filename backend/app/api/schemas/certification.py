from pydantic import Field
from typing import List, Optional
from app.api.schemas.common import CamelModel, PaginatedResponse
from app.api.schemas.sources import SourceResponse
from app.api.schemas.testing import SourceRefResponse, TestingRequirementResponse

class ProcessStepResponse(CamelModel):
    order: int
    title: str
    description: str
    estimated_duration: Optional[str] = Field(default=None, alias="estimatedDuration")
    actor: str = "applicant"  # 'applicant', 'bis', 'laboratory', 'third_party'
    required_document_ids: Optional[List[str]] = Field(default_factory=list, alias="requiredDocumentIds")
    source_ref: Optional[SourceRefResponse] = Field(default=None, alias="sourceRef")

class RequiredDocumentResponse(CamelModel):
    id: str
    name: str
    description: Optional[str] = None
    is_mandatory: bool = Field(default=True, alias="isMandatory")
    format: Optional[str] = None
    source_ref: Optional[SourceRefResponse] = Field(default=None, alias="sourceRef")

class FaqItemResponse(CamelModel):
    id: str
    question: str
    answer: str
    source_ref: Optional[SourceRefResponse] = Field(default=None, alias="sourceRef")

class CertificationSchemeResponse(CamelModel):
    id: str
    name: str
    short_name: Optional[str] = Field(default=None, alias="shortName")
    description: str
    audience: List[str] = Field(default_factory=list)  # 'industry', 'msme', 'foreign_manufacturer', 'consumer'
    is_mandatory_for_some_products: bool = Field(default=False, alias="isMandatoryForSomeProducts")
    eligibility: List[str] = Field(default_factory=list)
    process: List[ProcessStepResponse] = Field(default_factory=list)
    required_documents: List[RequiredDocumentResponse] = Field(default_factory=list, alias="requiredDocuments")
    testing_requirements: List[TestingRequirementResponse] = Field(default_factory=list, alias="testingRequirements")
    faqs: List[FaqItemResponse] = Field(default_factory=list)
    related_standard_ids: List[str] = Field(default_factory=list, alias="relatedStandardIds")
    sources: List[SourceResponse] = Field(default_factory=list)
    official_url: Optional[str] = Field(default=None, alias="officialUrl")
    is_demo: bool = Field(default=False, alias="isDemo")

CertificationSchemesListResponse = PaginatedResponse[CertificationSchemeResponse]
