# DIMENSHOP Backend

## Overview
Python FastAPI backend for DIMENSHOP.
Handles 3D processing pipeline, analytics, and push notifications.

## Architecture
```
app/
├── api/          # Route handlers (v1 versioned)
│   └── v1/       # Version 1 endpoints
├── core/         # Config, security, exceptions
├── models/       # Pydantic request/response schemas
├── services/     # Business logic layer
├── workers/      # Celery tasks (COLMAP pipeline)
└── utils/        # Helpers and utilities
```

## Running Locally
```bash
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Running Workers
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

## Running Tests
```bash
pytest
```
