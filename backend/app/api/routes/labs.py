from fastapi import APIRouter
from typing import List
from app.api.schemas.testing import LaboratoryResponse

router = APIRouter()

@router.get("", response_model=List[LaboratoryResponse])
async def list_labs():
    from app.utils.demo_data import get_demo_labs
    return get_demo_labs()

@router.get("/{id}", response_model=LaboratoryResponse)
async def get_lab(id: str):
    from app.utils.demo_data import get_demo_labs
    for l in get_demo_labs():
        if l['id'] == id:
            return l
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Laboratory not found")
