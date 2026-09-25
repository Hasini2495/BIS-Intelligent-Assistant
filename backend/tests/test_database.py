import pytest
from sqlalchemy import select, func
from app.core.database import Base, async_session_maker, init_db
from app.models import (
    Standard,
    CertificationScheme,
    Laboratory,
    BISService,
    Document,
    Source,
    Conversation,
    Message,
    Feedback
)
from app.services.seed_service import seed_database_if_empty

@pytest.mark.asyncio
async def test_database_models_registered():
    table_names = Base.metadata.tables.keys()
    expected_tables = [
        "standards",
        "certification_schemes",
        "laboratories",
        "services",
        "documents",
        "sources",
        "conversations",
        "messages",
        "feedback"
    ]
    for table in expected_tables:
        assert table in table_names, f"Table '{table}' should be registered in Base.metadata"

@pytest.mark.asyncio
async def test_database_seed_and_query():
    await init_db()
    await seed_database_if_empty()

    async with async_session_maker() as session:
        # Check standards
        res = await session.execute(select(func.count(Standard.id)))
        count = res.scalar_one()
        assert count >= 6, "At least 6 official BIS standards should be seeded"

        # Check IS 456
        res = await session.execute(select(Standard).where(Standard.id == "std-1"))
        std = res.scalar_one_or_none()
        assert std is not None
        assert "IS 456" in std.standard_number
        assert len(std.clauses) >= 4
