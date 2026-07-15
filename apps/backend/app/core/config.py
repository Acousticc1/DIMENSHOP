from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    SUPABASE_URL: str = Field(default="https://your-project.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="")
    SUPABASE_JWT_SECRET: str = Field(default="")
    
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    
    COLMAP_BINARY_PATH: str = Field(default="/usr/local/bin/colmap")
    COLMAP_WORKSPACE: str = Field(default="/tmp/colmap_workspace")
    
    MODEL_BUCKET: str = Field(default="models")
    IMAGE_BUCKET: str = Field(default="product-images")
    
    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default="INFO")
    API_V1_PREFIX: str = Field(default="/api/v1")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
