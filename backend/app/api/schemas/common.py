from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from typing import Generic, TypeVar, List, Optional, Any

T = TypeVar("T")

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True
    )

class PaginatedResponse(CamelModel, Generic[T]):
    items: List[T]
    page: int = 1
    page_size: int = Field(10, alias="pageSize")
    total: int = 0
    has_more: bool = Field(False, alias="hasMore")
    
    @property
    def total_pages(self) -> int:
        if self.page_size <= 0:
            return 1
        return (self.total + self.page_size - 1) // self.page_size

class ErrorDetail(CamelModel):
    code: str = "ERROR"
    message_key: str = Field("unknown_error", alias="messageKey")
    detail: Optional[str] = None
    correlation_id: Optional[str] = Field(None, alias="correlationId")

class ErrorResponse(CamelModel):
    error: ErrorDetail

class HealthResponse(CamelModel):
    status: str
    version: str
    mode: str
