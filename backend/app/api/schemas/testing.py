from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TestingRequirementResponse(BaseModel):
    test_name: str
    description: str

class LaboratoryResponse(BaseModel):
    id: str
    name: str
    location: str
    contact_info: Optional[Dict[str, str]] = None
    accreditation_status: str
    testing_scope: List[str] = []
