import pytest
from httpx import AsyncClient, ASGITransport
import app.models
from app.main import app as fastapi_app
from app.core.database import init_db
from app.services.seed_service import seed_database_if_empty
from app.services.document_service import ensure_seeded_sample_files

@pytest.fixture(autouse=True)
async def init_test_db():
    await init_db()
    await seed_database_if_empty()
    ensure_seeded_sample_files()

@pytest.fixture
async def client():
    transport = ASGITransport(app=fastapi_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


