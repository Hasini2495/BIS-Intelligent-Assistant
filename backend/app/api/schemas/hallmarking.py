from typing import Optional
from app.api.schemas.common import CamelModel

class HallmarkingVerifyRequest(CamelModel):
    huid: str

class HallmarkingVerifyResponse(CamelModel):
    huid: str
    is_format_valid: bool
    is_officially_verified: bool
    status: str # 'format_valid' | 'invalid_format' | 'verified_official' | 'unverified_official'
    metal_type: Optional[str] = None
    purity: Optional[str] = None
    assaying_center: Optional[str] = None
    message: str
    verified_at: str
