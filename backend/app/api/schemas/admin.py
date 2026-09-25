from typing import List, Optional, Dict, Any
from app.api.schemas.common import CamelModel

class AdminMetricsResponse(CamelModel):
    total_users: int
    total_documents: int
    ingestion_queue: int
    failed_documents: int
    indexed_documents: int
    open_feedback: int
    total_queries: int
    unique_users: int
    unresolved_queries: int
    document_indexed_percentage: float
    user_growth_rate: float

class DailyMetricPoint(CamelModel):
    date: str
    queries: int
    users: int
    unresolved: int

class TopQueryItem(CamelModel):
    query: str
    count: int
    standard_number: Optional[str] = None

class AdminAnalyticsResponse(CamelModel):
    time_range: str
    total_queries: int
    unique_users: int
    unresolved_queries: int
    query_growth_rate: float
    retrieval_accuracy_percentage: float
    average_latency_ms: float
    daily_metrics: List[DailyMetricPoint]
    top_queries: List[TopQueryItem]

class KnowledgeBaseItemResponse(CamelModel):
    id: str
    title: str
    type: str # 'Standard' | 'Document' | 'Service' | 'FAQ'
    status: str # 'indexed' | 'processing' | 'failed'
    version: str
    size: Optional[str] = None
    uploaded_on: Optional[str] = None
