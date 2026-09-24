from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Source(Base):
    __tablename__ = "sources"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    url = Column(String, nullable=True)
    source_type = Column(String)
    documents = relationship("Document", back_populates="source")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("sources.id"))
    content = Column(String)
    metadata_ = Column("metadata", JSON, nullable=True)
    source = relationship("Source", back_populates="documents")
