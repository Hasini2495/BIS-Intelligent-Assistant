from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.api.schemas.standards import StandardResponse, StandardListResponse
from app.services.seed_service import SEED_STANDARDS
from app.core.exceptions import NotFoundError
from app.dependencies import get_db
from app.models.standard import Standard

router = APIRouter()

def _map_standard(data: dict) -> StandardResponse:
    return StandardResponse(
        id=data["id"],
        standardNumber=data["standard_number"],
        title=data["title"],
        status=data.get("status", "active"),
        year=data.get("year"),
        reaffirmedYear=data.get("reaffirmed_year"),
        revision=data.get("revision"),
        description=data.get("description", data.get("abstract", "")),
        scope=data.get("scope"),
        sectors=data.get("sectors", []),
        categories=data.get("categories", []),
        icsCode=data.get("ics_code"),
        language=data.get("language", "en"),
        pageCount=data.get("page_count", 20),
        clauses=data.get("clauses", []),
        relatedStandards=data.get("related_standards", []),
        certificationRelevance=data.get("certification_relevance"),
        sourceDocumentId=data.get("source_document_id"),
        officialUrl=data.get("official_url", "https://standardsbis.bsbedge.com"),
        isFullTextAvailable=data.get("is_full_text_available", True),
        isDemo=False
    )

@router.get("", response_model=StandardListResponse)
async def list_standards(
    q: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100, alias="pageSize"),
    db: AsyncSession = Depends(get_db)
):
    filtered = SEED_STANDARDS
    if q:
        q_clean = q.lower().strip()
        filtered = [
            s for s in filtered
            if q_clean in s["title"].lower()
            or q_clean in s["standard_number"].lower()
            or any(q_clean in k.lower() for k in s.get("keywords", []))
        ]
    if sector:
        filtered = [s for s in filtered if sector.lower() in [sec.lower() for sec in s.get("sectors", [])]]
    if status:
        filtered = [s for s in filtered if s.get("status", "active").lower() == status.lower()]

    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    items = [_map_standard(s) for s in filtered[start:end]]
    has_more = end < total

    return StandardListResponse(
        items=items,
        page=page,
        pageSize=page_size,
        total=total,
        hasMore=has_more
    )

@router.get("/number/{standard_number:path}", response_model=StandardResponse)
async def get_standard_by_number(standard_number: str):
    std_norm = standard_number.replace("-", " ").replace(":", " ").lower()
    for s in SEED_STANDARDS:
        s_norm = s["standard_number"].replace("-", " ").replace(":", " ").lower()
        if std_norm in s_norm or s_norm in std_norm:
            return _map_standard(s)
    raise NotFoundError(f"Standard '{standard_number}' not found")

@router.get("/{id}", response_model=StandardResponse)
async def get_standard(id: str):
    for s in SEED_STANDARDS:
        if s["id"] == id:
            return _map_standard(s)
    raise NotFoundError(f"Standard with ID '{id}' not found")
