from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProcessStepResponse(BaseModel):
    step_number: int
    description: str

class CertificationSchemeResponse(BaseModel):
    id: str
    name: str
    description: str
    process: List[ProcessStepResponse] = []
    docs_required: List[str] = []
    faqs: List[Dict[str, str]] = []
