from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import health, jobs, analytics, notifications

app = FastAPI(
    title="DIMENSHOP 3D Processing Backend",
    description="Python backend handles photogrammetry processing queues, analytics, and notifications.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to mobile app domain scheme / host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(jobs.router, prefix="/api/v1", tags=["Jobs"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(notifications.router, prefix="/api/v1", tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "app": "DIMENSHOP Backend API",
        "status": "online",
        "version": "1.0.0"
    }
