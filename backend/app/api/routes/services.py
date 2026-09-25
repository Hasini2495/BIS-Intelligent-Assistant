from fastapi import APIRouter, Query
from typing import Optional
from app.api.schemas.services import BISServiceResponse, ServicesListResponse
from app.services.seed_service import SEED_SERVICES
from app.core.exceptions import NotFoundError

router = APIRouter()

def _map_service(data: dict) -> BISServiceResponse:
    return BISServiceResponse(
        id=data["id"],
        name=data["name"],
        category=data.get("category", "standards"),
        shortDescription=data["short_description"],
        description=data.get("description"),
        audience=data.get("audience", ["industry", "consumer"]),
        howToAvail=data.get("how_to_avail"),
        relatedServiceIds=data.get("related_service_ids", []),
        relatedStandardIds=data.get("related_standard_ids", []),
        officialUrl=data.get("official_url"),
        sources=[],
        isDemo=False
    )

@router.get("", response_model=ServicesListResponse)
async def list_services(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100, alias="pageSize")
):
    total = len(SEED_SERVICES)
    start = (page - 1) * page_size
    end = start + page_size
    items = [_map_service(s) for s in SEED_SERVICES[start:end]]
    has_more = end < total

    return ServicesListResponse(
        items=items,
        page=page,
        pageSize=page_size,
        total=total,
        hasMore=has_more
    )

@router.get("/{id}", response_model=BISServiceResponse)
async def get_service(id: str):
    for s in SEED_SERVICES:
        if s["id"] == id:
            return _map_service(s)
    raise NotFoundError(f"BIS Service with ID '{id}' not found")
