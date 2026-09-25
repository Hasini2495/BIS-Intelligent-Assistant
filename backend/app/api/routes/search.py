from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from app.api.schemas.common import CamelModel
from app.services.seed_service import SEED_STANDARDS, SEED_SCHEMES, SEED_LABS, SEED_SERVICES

class SearchRequest(CamelModel):
    query: str
    filters: Optional[dict] = None

class SearchResultResponse(CamelModel):
    id: str
    type: str  # standard, scheme, lab, service
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

router = APIRouter()

@router.post("", response_model=List[SearchResultResponse])
async def search_endpoint(request: SearchRequest):
    q = request.query.lower().strip()
    results: List[SearchResultResponse] = []

    # 1. Standards
    for s in SEED_STANDARDS:
        if q in s["title"].lower() or q in s["standard_number"].lower() or any(q in k.lower() for k in s.get("keywords", [])):
            results.append(SearchResultResponse(
                id=s["id"],
                type="standard",
                title=f"{s['standard_number']} - {s['title']}",
                description=s.get("description", s.get("abstract")),
                url=f"/standards/{s['id']}"
            ))

    # 2. Schemes
    for sc in SEED_SCHEMES:
        if q in sc["name"].lower() or q in sc.get("short_name", "").lower() or q in sc["description"].lower():
            results.append(SearchResultResponse(
                id=sc["id"],
                type="scheme",
                title=sc["name"],
                description=sc["description"],
                url=f"/certification/schemes/{sc['id']}"
            ))

    # 3. Labs
    for l in SEED_LABS:
        if q in l["name"].lower() or q in l.get("city", "").lower() or any(q in s.lower() for s in l.get("scopes", [])):
            results.append(SearchResultResponse(
                id=l["id"],
                type="lab",
                title=l["name"],
                description=f"Location: {l.get('city')}, {l.get('state')} | Scopes: {', '.join(l.get('scopes', []))}",
                url=f"/testing/labs/{l['id']}"
            ))

    # 4. Services
    for sv in SEED_SERVICES:
        if q in sv["name"].lower() or q in sv["short_description"].lower():
            results.append(SearchResultResponse(
                id=sv["id"],
                type="service",
                title=sv["name"],
                description=sv["short_description"],
                url=f"/services/{sv['id']}"
            ))

    return results[:20]
