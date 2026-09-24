from fastapi import APIRouter
from app.api.routes import health, chat, search, standards, sources, documents, conversations, feedback, languages, services, labs, certification

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(standards.router, prefix="/standards", tags=["standards"])
router.include_router(sources.router, prefix="/sources", tags=["sources"])
router.include_router(documents.router, prefix="/documents", tags=["documents"])
router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
router.include_router(languages.router, prefix="/languages", tags=["languages"])
router.include_router(services.router, prefix="/services", tags=["services"])
router.include_router(labs.router, prefix="/labs", tags=["labs"])
router.include_router(certification.router, prefix="/certification/schemes", tags=["certification"])
