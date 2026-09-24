from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ServiceResponse(BaseModel):
    id: str
    name: str
    description: str
    url: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None

class ServiceListResponse(BaseModel):
    items: List[ServiceResponse]
    total: int
