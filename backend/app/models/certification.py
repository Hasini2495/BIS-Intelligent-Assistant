from sqlalchemy import Column, String, JSON
from app.core.database import Base

class CertificationScheme(Base):
    __tablename__ = "certification_schemes"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    process = Column(JSON, nullable=True)
    docs_required = Column(JSON, nullable=True)
    faqs = Column(JSON, nullable=True)
