from sqlalchemy import Column, String, Integer, JSON, Boolean
from app.core.database import Base

class Standard(Base):
    __tablename__ = "standards"
    id = Column(String, primary_key=True, index=True)
    standard_number = Column(String, index=True)
    title = Column(String)
    year = Column(Integer)
    status = Column(String)
    department = Column(String)
    committee = Column(String)
    abstract = Column(String, nullable=True)
    is_demo = Column(Boolean, default=False)
    keywords = Column(JSON, nullable=True)
    clauses = Column(JSON, nullable=True)
