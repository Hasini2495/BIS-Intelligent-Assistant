from fastapi import APIRouter, Query
from typing import Optional
from app.api.schemas.testing import LaboratoryResponse, LaboratoriesListResponse
from app.services.seed_service import SEED_LABS
from app.core.exceptions import NotFoundError

router = APIRouter()

def _map_lab(data: dict) -> LaboratoryResponse:
    return LaboratoryResponse(
        id=data["id"],
        name=data["name"],
        city=data.get("city"),
        state=data.get("state"),
        region=data.get("region"),
        recognitionType=data.get("recognition_type", "bis_recognized"),
        recognitionNumber=data.get("recognition_number"),
        validUntil=data.get("valid_until"),
        scopes=data.get("scopes", []),
        disciplines=data.get("disciplines", []),
        contact=data.get("contact"),
        sources=[],
        isDemo=False,
        dataDisclaimerKey="disclaimers.official_source_check"
    )

@router.get("", response_model=LaboratoriesListResponse)
async def list_labs(
    q: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100, alias="pageSize")
):
    filtered = SEED_LABS
    if q:
        q_clean = q.lower().strip()
        filtered = [
            l for l in filtered
            if q_clean in l["name"].lower()
            or q_clean in l.get("city", "").lower()
            or any(q_clean in s.lower() for s in l.get("scopes", []))
        ]
    if region:
        filtered = [l for l in filtered if region.lower() in l.get("region", "").lower()]

    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    items = [_map_lab(l) for l in filtered[start:end]]
    has_more = end < total

    return LaboratoriesListResponse(
        items=items,
        page=page,
        pageSize=page_size,
        total=total,
        hasMore=has_more
    )

@router.get("/{id}", response_model=LaboratoryResponse)
async def get_lab(id: str):
    for l in SEED_LABS:
        if l["id"] == id:
            return _map_lab(l)
    raise NotFoundError(f"Laboratory with ID '{id}' not found")
