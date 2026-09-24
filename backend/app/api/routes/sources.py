from fastapi import APIRouter
from app.api.schemas.sources import SourceResponse

router = APIRouter()

@router.get("/{id}", response_model=SourceResponse)
async def get_source(id: str):
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Source not found")
