from sqlalchemy import Column, String, JSON
from app.core.database import Base

class BISService(Base):
    __tablename__ = "services"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    url = Column(String, nullable=True)
    requirements = Column(JSON, nullable=True)
