# Domain Layer

## Purpose
The domain layer is the innermost layer of the clean architecture.
It contains business entities, repository interfaces, and domain errors.

## Rules
- **ZERO** external dependencies (no React, no Supabase, no framework code)
- Only pure TypeScript types, interfaces, and classes
- All properties are `readonly` to enforce immutability
- Repository interfaces define contracts — implementations live in Infrastructure

## Structure
```
domain/
├── entities/        # Business models (User, Product, Order, etc.)
├── repositories/    # Interface contracts for data access
├── errors/          # Domain-specific error classes
└── README.md
```

## Dependency Rule
The domain layer depends on NOTHING. All other layers depend on it.
```
Presentation → Application → Domain ← Infrastructure
```
