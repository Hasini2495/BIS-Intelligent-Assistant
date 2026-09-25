from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
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
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    title = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    mime_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    document_type = Column(String, default="knowledge_source") # 'compliance_evidence', 'knowledge_source', 'standard', 'report', 'user_manual', 'certificate'
    status = Column(String, default="indexed") # 'uploaded', 'processing', 'indexed', 'failed'
    error_message = Column(String, nullable=True)
    uploaded_by = Column(String, nullable=True)
    content = Column(String, nullable=True)
    metadata_ = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    source = relationship("Source", back_populates="documents")
