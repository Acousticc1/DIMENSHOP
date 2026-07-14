# Presentation Layer

## Purpose
Contains all React Native UI code: screens, components, navigation, and styles.

## Rules
- May depend on Application layer (stores, hooks)
- Must NOT import directly from Infrastructure layer
- Components should be pure and reusable
- Screens compose components and connect to stores
- No business logic in this layer

## Structure
```
presentation/
├── components/
│   ├── ui/          # Generic reusable components (Button, Input, Card)
│   ├── product/     # Product-specific components
│   └── viewer/      # 3D viewer components
├── screens/
│   ├── auth/        # Authentication screens
│   ├── buyer/       # Buyer dashboard screens
│   └── seller/      # Seller dashboard screens
├── styles/          # Design system tokens
└── README.md
```
