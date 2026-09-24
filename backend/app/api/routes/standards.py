from fastapi import APIRouter
from typing import List, Optional
from app.api.schemas.standards import StandardListResponse, StandardResponse
from app.utils.demo_data import get_demo_standards

router = APIRouter()

@router.get("", response_model=StandardListResponse)
async def list_standards(q: Optional[str] = None, page: int = 1, size: int = 10):
    all_stds = get_demo_standards()
    if q:
        q = q.lower()
        all_stds = [s for s in all_stds if q in s['title'].lower() or q in s['standard_number'].lower()]
    start = (page - 1) * size
    end = start + size
    return StandardListResponse(items=all_stds[start:end], total=len(all_stds))

@router.get("/{id}", response_model=StandardResponse)
async def get_standard(id: str):
    stds = get_demo_standards()
    for s in stds:
        if s['id'] == id:
            return s
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Standard not found")
