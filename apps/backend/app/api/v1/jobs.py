from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.api.deps import get_current_user, verify_seller_role
from app.models.job import JobCreate, JobResponse
from app.core.supabase import supabase_client
from app.utils.logger import logger

router = APIRouter(prefix="/jobs")

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_processing_job(
    payload: JobCreate,
    current_user: dict = Depends(verify_seller_role)
):
    """
    Triggers a new 3D mesh photogrammetry generation task.
    Requires seller authentication.
    """
    logger.info(f"Triggering 3D reconstruction job for product {payload.product_id}")
    
    # 1. Verify product belongs to seller and is in draft state
    product_res = supabase_client.from_("products").select("*").eq("id", payload.product_id).execute()
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product = product_res.data[0]
    if product.get("seller_id") != current_user.get("user_id"):
        raise HTTPException(status_code=403, detail="Not authorized to edit this product")

    # 2. Insert new job record in processing_jobs table
    job_payload = {
        "product_id": payload.product_id,
        "seller_id": current_user.get("user_id"),
        "status": "queued",
        "progress": 0,
        "pipeline_metadata": {"image_urls": payload.image_urls}
    }
    
    job_res = supabase_client.from_("processing_jobs").insert(job_payload).execute()
    if not job_res.data:
        raise HTTPException(status_code=500, detail="Failed to register 3D job in database")
        
    job = job_res.data[0]
    job_id = job.get("id")

    # 3. Update product status to processing
    supabase_client.from_("products").update({"status": "processing"}).eq("id", payload.product_id).execute()

    # 4. Trigger Celery Task (Queued in Redis)
    try:
        # Import celery app dynamically to prevent circular dependencies
        from app.workers.celery_app import process_photogrammetry_task
        process_photogrammetry_task.delay(job_id)
        logger.info(f"Celery task dispatched for job ID: {job_id}")
    except Exception as e:
        logger.error(f"Failed to dispatch Celery worker task: {str(e)}")
        # We don't fail the request since job is already tracked in database

    return job

@router.get("/{job_id}", response_model=JobResponse)
async def get_job_status(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve current progress status and details of a specific 3D job.
    """
    res = supabase_client.from_("processing_jobs").select("*").eq("id", job_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Processing job not found")
        
    job = res.data[0]
    
    # Check authorization (seller owns it, or admin)
    if job.get("seller_id") != current_user.get("user_id") and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this job")
        
    return job

@router.get("", response_model=List[JobResponse])
async def list_processing_jobs(
    current_user: dict = Depends(get_current_user)
):
    """
    List all active and historical 3D jobs uploaded by the authenticated user.
    """
    query = supabase_client.from_("processing_jobs").select("*")
    
    # If user is a seller, filter to their jobs
    if current_user.get("role") == "seller":
        query = query.eq("seller_id", current_user.get("user_id"))
        
    res = query.order("created_at", { "ascending": False }).execute()
    return res.data or []

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
async def cancel_processing_job(
    job_id: str,
    current_user: dict = Depends(verify_seller_role)
):
    """
    Cancel a queued or active 3D job. Updates status to failed.
    """
    res = supabase_client.from_("processing_jobs").select("*").eq("id", job_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Processing job not found")
        
    job = res.data[0]
    if job.get("seller_id") != current_user.get("user_id"):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this job")
        
    # Cancel job status in DB
    supabase_client.from_("processing_jobs").update({
        "status": "failed",
        "error_message": "Cancelled by seller"
    }).eq("id", job_id).execute()
    
    logger.info(f"Job {job_id} cancelled by seller")
    return {"status": "cancelled", "job_id": job_id}
