from fastapi import APIRouter
from app.api.schemas.sources import SourceResponse
from app.services.seed_service import SEED_SOURCES, SEED_STANDARDS, SEED_DOCUMENTS
from app.core.exceptions import NotFoundError

router = APIRouter()

@router.get("/{id}", response_model=SourceResponse)
async def get_source(id: str):
    # 1. Match direct sources
    for s in SEED_SOURCES:
        if s["id"] == id:
            return SourceResponse(**s)

    # 2. Match standard source e.g. src_std-1 or std-1
    clean_id = id.replace("src_", "")
    for std in SEED_STANDARDS:
        if std["id"] == clean_id or f"src_{std['id']}" == id:
            return SourceResponse(
                id=id,
                citationIndex=1,
                title=f"{std['standard_number']} - {std['title']}",
                documentId=clean_id,
                documentName=std["title"],
                sourceType="indian_standard",
                standardNumber=std["standard_number"],
                section="Official Standard Specification",
                authority="Bureau of Indian Standards",
                publicationDate=f"{std.get('year', 2020)}-01-01",
                url=std.get("official_url", "https://standardsbis.bsbedge.com"),
                isOfficial=True,
                isDemo=False,
                relevance="high",
                relevanceScore=1.0,
                excerpt=std.get("description", std.get("scope", ""))
            )

    # 3. Match document source
    for doc in SEED_DOCUMENTS:
        if doc["id"] == clean_id or f"src_{doc['id']}" == id:
            return SourceResponse(
                id=id,
                citationIndex=1,
                title=doc["title"],
                documentId=clean_id,
                documentName=doc["title"],
                sourceType=doc.get("document_type", "guideline"),
                standardNumber=doc.get("standard_number"),
                authority=doc.get("authority", "Bureau of Indian Standards"),
                publicationDate=doc.get("publication_date"),
                url=doc.get("url"),
                isOfficial=True,
                isDemo=False,
                relevance="high",
                relevanceScore=1.0,
                excerpt=doc.get("title")
            )

    raise NotFoundError(f"Source '{id}' not found")
