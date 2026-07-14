# Infrastructure Layer

## Purpose
Contains concrete implementations of domain repository interfaces.
All external service communication lives here.

## Rules
- Implements interfaces defined in Domain layer
- Contains Supabase SDK calls, API clients, storage services
- Never imported directly by Presentation layer
- Application layer uses these through dependency injection

## Structure
```
infrastructure/
├── supabase/        # Supabase client and config
├── repositories/    # Concrete repository implementations
├── api/             # FastAPI client
├── storage/         # File upload/download services
└── README.md
```
