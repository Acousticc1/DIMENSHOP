# Application Layer

## Purpose
Orchestration layer containing use cases, state management (Zustand stores),
and reusable application-level hooks.

## Rules
- May depend on Domain layer (entities, interfaces)
- May depend on Infrastructure layer (for implementations)
- Must NOT depend on Presentation layer (no React components)
- Zustand stores are the single source of truth

## Structure
```
application/
├── stores/      # Zustand state stores
├── hooks/       # Reusable application hooks
└── README.md
```
