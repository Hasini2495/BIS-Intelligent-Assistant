from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message_id = Column(String, index=True, nullable=True)
    user_id = Column(String, index=True, nullable=True)
    rating = Column(Integer, nullable=True) # e.g. 1-5 or -1/1
    category = Column(String, default="general") # 'accuracy', 'clarity', 'speed', 'general'
    comment = Column(String, nullable=True)
    status = Column(String, default="open") # 'open', 'reviewed', 'resolved'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
