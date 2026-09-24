from pydantic import BaseModel
from typing import Generic, TypeVar, List, Optional, Any

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    
class ErrorDetail(BaseModel):
    message: str
    type: str

class ErrorResponse(BaseModel):
    error: ErrorDetail

class HealthResponse(BaseModel):
    status: str
    version: str
    mode: str
