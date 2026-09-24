from fastapi import APIRouter
from app.api.schemas.services import ServiceListResponse, ServiceResponse

router = APIRouter()

@router.get("", response_model=ServiceListResponse)
async def list_services():
    from app.utils.demo_data import get_demo_services
    srvs = get_demo_services()
    return ServiceListResponse(items=srvs, total=len(srvs))

@router.get("/{id}", response_model=ServiceResponse)
async def get_service(id: str):
    from app.utils.demo_data import get_demo_services
    for s in get_demo_services():
        if s['id'] == id:
            return s
    from app.core.exceptions import NotFoundError
    raise NotFoundError("Service not found")
