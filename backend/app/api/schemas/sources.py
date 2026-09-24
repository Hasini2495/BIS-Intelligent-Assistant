from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SourceResponse(BaseModel):
    id: str
    title: str
    url: Optional[str] = None
    source_type: str

class DocumentResponse(BaseModel):
    id: str
    source_id: str
    content: str
    metadata: Optional[Dict[str, Any]] = None
