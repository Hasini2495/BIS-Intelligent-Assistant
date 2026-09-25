import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import get_settings

settings = get_settings()

# If sqlite database URL specifies a directory, ensure directory exists
if "sqlite" in settings.DATABASE_URL:
    db_path = settings.DATABASE_URL.split("///")[-1]
    if db_path and not db_path.startswith(":memory:"):
        db_dir = os.path.dirname(os.path.abspath(db_path))
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

engine = create_async_engine(settings.DATABASE_URL, echo=(settings.LOG_LEVEL == "DEBUG"))
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

Base = declarative_base()

async def init_db():
    import app.models  # Register all models with Base.metadata
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Safe migration for existing SQLite database files
        def sync_migrate(connection):
            from sqlalchemy import text
            try:
                res = connection.execute(text("PRAGMA table_info(documents)")).fetchall()
                existing_cols = {row[1] for row in res}
                if existing_cols:
                    doc_cols = [
                        ("title", "VARCHAR"),
                        ("original_filename", "VARCHAR"),
                        ("file_path", "VARCHAR"),
                        ("mime_type", "VARCHAR"),
                        ("file_size", "INTEGER"),
                        ("document_type", "VARCHAR DEFAULT 'knowledge_source'"),
                        ("status", "VARCHAR DEFAULT 'indexed'"),
                        ("error_message", "VARCHAR"),
                        ("uploaded_by", "VARCHAR"),
                        ("created_at", "DATETIME"),
                        ("updated_at", "DATETIME"),
                    ]
                    for col_name, col_type in doc_cols:
                        if col_name not in existing_cols:
                            connection.execute(text(f"ALTER TABLE documents ADD COLUMN {col_name} {col_type}"))
            except Exception:
                pass

            try:
                res = connection.execute(text("PRAGMA table_info(feedback)")).fetchall()
                existing_cols = {row[1] for row in res}
                if existing_cols:
                    fb_cols = [
                        ("user_id", "VARCHAR"),
                        ("category", "VARCHAR DEFAULT 'general'"),
                        ("status", "VARCHAR DEFAULT 'open'"),
                    ]
                    for col_name, col_type in fb_cols:
                        if col_name not in existing_cols:
                            connection.execute(text(f"ALTER TABLE feedback ADD COLUMN {col_name} {col_type}"))
            except Exception:
                pass

        await conn.run_sync(sync_migrate)

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session
