from fastapi import APIRouter
from typing import List
from app.api.schemas.certification import CertificationSchemeResponse

router = APIRouter()

@router.get("", response_model=List[CertificationSchemeResponse])
async def list_certification_schemes():
    from app.utils.demo_data import get_demo_schemes
    return get_demo_schemes()

@router.get("/{id}", response_model=CertificationSchemeResponse)
async def get_certification_scheme(id: str):
    from app.utils.demo_data import get_demo_schemes
    for s in get_demo_schemes():
        if s['id'] == id:
            return s
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Scheme not found")
