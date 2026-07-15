from fastapi import APIRouter
from typing import Dict

router = APIRouter()

@app_router_get := router.get("/health")
async def health_check() -> Dict[str, str]:
    return {
        "status": "healthy",
        "service": "dimenshop-3d-pipeline",
        "redis": "connected" # In Phase 13/15, verify active Redis connection
    }
