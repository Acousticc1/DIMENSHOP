# DIMENSHOP Architecture

See Phase 1 implementation plan for full architecture documentation.

## Layers
1. **Domain** — Business entities, repository interfaces, domain errors
2. **Application** — Use cases, Zustand stores, hooks
3. **Infrastructure** — Supabase SDK, FastAPI client, storage services
4. **Presentation** — React Native screens, components, navigation

## Backend
- FastAPI for 3D pipeline orchestration
- Celery + Redis for job queue
- COLMAP for photogrammetry
- Supabase for auth, DB, storage
