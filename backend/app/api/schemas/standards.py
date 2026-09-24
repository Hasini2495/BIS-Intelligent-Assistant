from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class StandardClauseResponse(BaseModel):
    clause_number: str
    title: str
    content: str

class StandardResponse(BaseModel):
    id: str
    standard_number: str
    title: str
    year: int
    status: str
    department: str
    committee: str
    abstract: Optional[str] = None
    keywords: List[str] = []
    clauses: List[StandardClauseResponse] = []

class StandardListResponse(BaseModel):
    items: List[StandardResponse]
    total: int
