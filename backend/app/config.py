from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List, Optional

class Settings(BaseSettings):
    BACKEND_ENV: str = "development"
    BACKEND_PORT: int = 8000
    BACKEND_HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:5173"
    DATABASE_URL: str = "sqlite+aiosqlite:///./bis_assistant.db"
    
    LLM_PROVIDER: str = "gemini" # 'demo' | 'gemini' | 'sarvam'
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    SARVAM_API_KEY: Optional[str] = None
    EMBEDDING_PROVIDER: str = "demo"
    
    SECRET_KEY: str = "bis_secret_key_production_2026_secure"
    JWT_SECRET_KEY: str = "bis_jwt_super_secret_key_change_in_production_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    UPLOAD_DIR: str = "./data/uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024 # 25 MB
    
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = None
    
    OTP_PROVIDER: str = "console" # 'console' | 'sms' | 'email' | 'none'
    OTP_API_KEY: Optional[str] = None
    OTP_SENDER: Optional[str] = None
    OTP_EXPIRY_SECONDS: int = 300
    OTP_MAX_ATTEMPTS: int = 3
    
    LOG_LEVEL: str = "INFO"
    BACKEND_LOG_LEVEL: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    @property
    def is_demo_mode(self) -> bool:
        return self.LLM_PROVIDER.lower() == "demo"
        
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

@lru_cache()
def get_settings() -> Settings:
    return Settings()
