from sqlalchemy import Column, String, JSON
from app.core.database import Base

class Laboratory(Base):
    __tablename__ = "laboratories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    contact_info = Column(JSON, nullable=True)
    accreditation_status = Column(String)
    testing_scope = Column(JSON, nullable=True)
