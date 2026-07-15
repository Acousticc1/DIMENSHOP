from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class JobCreate(BaseModel):
    product_id: str = Field(..., description="The unique ID of the product mapping this 3D model")
    image_urls: List[str] = Field(..., min_items=5, description="List of public URLs of uploaded images for COLMAP photogrammetry")

class JobResponse(BaseModel):
    id: str
    product_id: str
    seller_id: str
    status: str
    progress: int
    error_message: Optional[str] = None
    model_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "job-uuid-1234",
                "product_id": "prod-uuid-5678",
                "seller_id": "user-uuid-9999",
                "status": "queued",
                "progress": 0,
                "created_at": "2026-07-15T12:00:00Z"
            }
        }
