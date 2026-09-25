from fastapi import APIRouter
from typing import List
from app.api.schemas.certification import CertificationSchemeResponse
from app.services.seed_service import SEED_SCHEMES
from app.core.exceptions import NotFoundError

router = APIRouter()

def _map_scheme(data: dict) -> CertificationSchemeResponse:
    return CertificationSchemeResponse(
        id=data["id"],
        name=data["name"],
        shortName=data.get("short_name"),
        description=data["description"],
        audience=data.get("audience", ["industry"]),
        isMandatoryForSomeProducts=data.get("is_mandatory_for_some_products", False),
        eligibility=data.get("eligibility", []),
        process=data.get("process", []),
        requiredDocuments=data.get("required_documents", []),
        testingRequirements=data.get("testing_requirements", []),
        faqs=data.get("faqs", []),
        relatedStandardIds=data.get("related_standard_ids", []),
        sources=[],
        officialUrl=data.get("official_url"),
        isDemo=False
    )

@router.get("", response_model=List[CertificationSchemeResponse])
@router.get("/schemes", response_model=List[CertificationSchemeResponse])
async def list_certification_schemes():
    return [_map_scheme(s) for s in SEED_SCHEMES]

@router.get("/schemes/{id}", response_model=CertificationSchemeResponse)
@router.get("/{id}", response_model=CertificationSchemeResponse)
async def get_certification_scheme(id: str):
    for s in SEED_SCHEMES:
        if s["id"] == id:
            return _map_scheme(s)
    raise NotFoundError(f"Certification scheme '{id}' not found")
