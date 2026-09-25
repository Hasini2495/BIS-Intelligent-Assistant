from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    item_id = Column(String, nullable=False, index=True)
    item_type = Column(String, nullable=False) # 'standard', 'document', 'answer', 'report', 'service'
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    link = Column(String, nullable=False)
    reference_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookmarks")
