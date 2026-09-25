from typing import Optional
from app.api.schemas.common import CamelModel

class NotificationResponse(CamelModel):
    id: str
    category: str # 'system' | 'standards' | 'validation' | 'updates'
    title: str
    description: str
    timestamp: str
    read: bool
    link: Optional[str] = None
