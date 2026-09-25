from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.core.database import init_db
from app.api.routes import router as api_router
from app.core.exceptions import setup_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    import app.models  # Register all models with Base.metadata
    await init_db()
    
    # Auto-seed database if empty
    from app.services.seed_service import seed_database_if_empty
    from app.services.document_service import ensure_seeded_sample_files
    await seed_database_if_empty()
    ensure_seeded_sample_files()
    
    yield
    # Shutdown

settings = get_settings()

app = FastAPI(
    title="BIS Intelligent Assistant API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(api_router, prefix="/api")
