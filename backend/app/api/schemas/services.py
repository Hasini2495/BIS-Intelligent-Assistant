from pydantic import Field
from typing import List, Optional
from app.api.schemas.common import CamelModel, PaginatedResponse
from app.api.schemas.sources import SourceResponse
from app.api.schemas.certification import ProcessStepResponse

class BISServiceResponse(CamelModel):
    id: str
    name: str
    category: str = "standards"  # 'certification', 'standards', 'testing', 'hallmarking', 'licensing', 'consumer', 'training', 'other'
    short_description: str = Field(..., alias="shortDescription")
    description: Optional[str] = None
    audience: List[str] = Field(default_factory=list)
    how_to_avail: Optional[List[ProcessStepResponse]] = Field(default=None, alias="howToAvail")
    related_service_ids: List[str] = Field(default_factory=list, alias="relatedServiceIds")
    related_standard_ids: List[str] = Field(default_factory=list, alias="relatedStandardIds")
    official_url: Optional[str] = Field(default=None, alias="officialUrl")
    sources: List[SourceResponse] = Field(default_factory=list)
    is_demo: bool = Field(default=False, alias="isDemo")

ServicesListResponse = PaginatedResponse[BISServiceResponse]
