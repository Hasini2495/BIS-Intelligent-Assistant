from fastapi import APIRouter, Depends
from app.api.schemas.common import HealthResponse
from app.config import get_settings, Settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health(settings: Settings = Depends(get_settings)):
    return HealthResponse(
        status="ok",
        version="0.1.0",
        mode=settings.LLM_PROVIDER
    )
