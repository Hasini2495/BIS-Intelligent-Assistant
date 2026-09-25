from pydantic import Field
from typing import List, Optional
from app.api.schemas.common import CamelModel, PaginatedResponse
from app.api.schemas.sources import SourceResponse

class SourceRefResponse(CamelModel):
    source_id: str = Field(..., alias="sourceId")
    standard_number: Optional[str] = Field(default=None, alias="standardNumber")
    clause: Optional[str] = None
    page: Optional[int] = None

class TestingRequirementResponse(CamelModel):
    id: str
    test_name: str = Field(..., alias="testName")
    description: Optional[str] = None
    test_type: str = Field(default="performance", alias="testType")  # 'mechanical', 'chemical', 'electrical', 'safety', 'performance', 'dimensional', 'environmental', 'other'
    applicable_product_categories: List[str] = Field(default_factory=list, alias="applicableProductCategories")
    standard_id: Optional[str] = Field(default=None, alias="standardId")
    standard_number: Optional[str] = Field(default=None, alias="standardNumber")
    clause: Optional[str] = None
    method: Optional[str] = None
    acceptance_criteria: Optional[str] = Field(default=None, alias="acceptanceCriteria")
    source_ref: Optional[SourceRefResponse] = Field(default=None, alias="sourceRef")
    is_demo: bool = Field(default=False, alias="isDemo")

class LaboratoryContactResponse(CamelModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class LaboratoryResponse(CamelModel):
    id: str
    name: str
    city: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    recognition_type: Optional[str] = Field(default="bis_recognized", alias="recognitionType")  # 'bis_recognized', 'nabl_accredited', 'in_house', 'unknown'
    recognition_number: Optional[str] = Field(default=None, alias="recognitionNumber")
    valid_until: Optional[str] = Field(default=None, alias="validUntil")
    scopes: List[str] = Field(default_factory=list)
    disciplines: List[str] = Field(default_factory=list)
    contact: Optional[LaboratoryContactResponse] = None
    sources: List[SourceResponse] = Field(default_factory=list)
    is_demo: bool = Field(default=False, alias="isDemo")
    data_disclaimer_key: str = Field(default="disclaimers.official_source_check", alias="dataDisclaimerKey")

LaboratoriesListResponse = PaginatedResponse[LaboratoryResponse]
