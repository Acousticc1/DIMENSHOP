from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/notifications")

@router.get("")
async def list_notifications(current_user: dict = Depends(get_current_user)):
    """
    List all active notifications for the current authenticated user.
    """
    return []
