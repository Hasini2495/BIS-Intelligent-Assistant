from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    BACKEND_ENV: str = "development"
    BACKEND_PORT: int = 8000
    BACKEND_HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:5173"
    DATABASE_URL: str = "sqlite+aiosqlite:///./bis_assistant.db"
    
    LLM_PROVIDER: str = "demo" # 'demo' | 'gemini' | 'sarvam'
    GEMINI_API_KEY: str | None = None
    SARVAM_API_KEY: str | None = None
    EMBEDDING_PROVIDER: str = "demo"
    
    SECRET_KEY: str = "change_this_in_production"
    LOG_LEVEL: str = "INFO"
    
    @property
    def is_demo_mode(self) -> bool:
        return self.LLM_PROVIDER.lower() == "demo"
        
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
