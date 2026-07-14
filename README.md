# DIMENSHOP

> Role-based 3D-enabled e-commerce mobile application

## Overview

DIMENSHOP allows sellers to upload product images, which are processed through a COLMAP photogrammetry pipeline to generate interactive 3D models (GLB). Buyers can browse products and interact with 3D models directly in the app.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo), TypeScript |
| State | Zustand |
| Forms | React Hook Form + Zod |
| 3D | Three.js, React Three Fiber |
| Auth/DB/Storage | Supabase |
| Backend | Python, FastAPI |
| Job Queue | Celery, Redis |
| 3D Pipeline | COLMAP, Open3D, trimesh |
| CI/CD | GitHub Actions |
| Containers | Docker |

## Project Structure

```
dimenshop/
├── apps/
│   ├── mobile/       # React Native (Expo) application
│   └── backend/      # Python FastAPI server
├── supabase/         # Database migrations and config
├── docker/           # Docker Compose configuration
├── docs/             # Project documentation
└── .github/          # CI/CD workflows
```

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.12+
- Expo CLI
- Supabase CLI
- Docker & Docker Compose

### Mobile App
```bash
cd apps/mobile
npm install
npx expo start
```

### Backend
```bash
cd apps/backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Docker (Backend + Worker + Redis)
```bash
cd docker
docker-compose up -d
```

## Architecture

Clean Architecture with four layers:
- **Domain** — Business entities and interfaces
- **Application** — Use cases and state management
- **Infrastructure** — External service implementations
- **Presentation** — UI screens and components

See [docs/architecture.md](docs/architecture.md) for details.

## License

MIT
