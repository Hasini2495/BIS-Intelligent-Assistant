from typing import Optional
from app.api.schemas.common import CamelModel

class BookmarkCreateRequest(CamelModel):
    item_id: str
    item_type: str # 'standard' | 'answer' | 'document' | 'report' | 'service'
    title: str
    subtitle: Optional[str] = None
    link: str
    reference_number: Optional[str] = None

class BookmarkResponse(CamelModel):
    id: str
    type: str
    title: str
    subtitle: Optional[str] = None
    saved_on: str
    link: str
    item_id: str
    reference_number: Optional[str] = None
