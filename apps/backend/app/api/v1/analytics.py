from fastapi import APIRouter, Depends
from app.api.deps import verify_seller_role

router = APIRouter(prefix="/analytics")

@router.get("/overview")
async def get_seller_analytics_overview(current_user: dict = Depends(verify_seller_role)):
    """
    Exposes sales metrics, click counts, and 3D viewer interaction logs.
    """
    return {
        "earnings": 1250.00,
        "sold_count": 8,
        "viewer_interactions": 142,
        "conversion_rate": 0.056
    }
