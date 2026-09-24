from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String, index=True)
    rating = Column(Integer) # e.g. 1-5 or -1/1
    comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
