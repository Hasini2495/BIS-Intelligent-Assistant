from fastapi import APIRouter
from app.api.schemas.sources import DocumentResponse

router = APIRouter()

@router.get("/{id}", response_model=DocumentResponse)
async def get_document(id: str):
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Document not found")
