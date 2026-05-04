# Skill: architecture

## Purpose
Design a clean, scalable folder structure and data flow for a 99acres-style real estate platform using React + Vite + TypeScript (frontend) and Node.js + Express + PostgreSQL (backend).

## When to Use
- Starting a new feature that spans multiple files
- Deciding where a new component, hook, or service belongs
- Reviewing existing structure for separation-of-concerns issues
- Planning a full-stack feature end-to-end

## Principles
- **Separation of concerns** — UI, business logic, and data access are always separate layers
- **Feature cohesion** — files that change together live together
- **Minimal indirection** — no abstraction unless it removes real duplication
- **Flat over nested** — prefer shallow trees; max 3 levels deep inside `src/`

## Frontend Architecture
```
src/
├── components/
│   ├── common/            # Navbar, Footer, Loader, ErrorBoundary, Modal
│   └── property/          # PropertyCard, PropertyGrid, PropertyFilters, ImageGallery
├── pages/
│   ├── HomePage.tsx
│   ├── SearchPage.tsx
│   ├── PropertyDetailPage.tsx
│   ├── PostPropertyPage.tsx
│   └── ProfilePage.tsx
├── services/              # All fetch/axios calls — one file per domain
│   ├── propertyService.ts
│   ├── authService.ts
│   └── locationService.ts
├── hooks/                 # Custom hooks — one per concern
│   ├── useProperties.ts
│   ├── useSearch.ts
│   ├── useAuth.ts
│   └── useDebounce.ts
├── context/
│   ├── AuthContext.tsx
│   └── FilterContext.tsx
├── types/
│   ├── property.ts
│   ├── user.ts
│   └── api.ts             # API response envelope types
├── utils/
│   ├── formatPrice.ts
│   ├── parseFilters.ts
│   └── constants.ts
└── assets/
```

## Backend Architecture
```
server/
├── src/
│   ├── routes/            # Express routers — thin, only route definitions
│   │   ├── propertyRoutes.ts
│   │   ├── authRoutes.ts
│   │   └── userRoutes.ts
│   ├── controllers/       # Request/response handling — call services, return JSON
│   │   ├── propertyController.ts
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── services/          # Business logic — no req/res objects here
│   │   ├── propertyService.ts
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── models/            # DB query functions (no ORM — raw pg queries)
│   │   ├── propertyModel.ts
│   │   └── userModel.ts
│   ├── middleware/
│   │   ├── auth.ts        # JWT verification
│   │   ├── validate.ts    # Request body validation
│   │   └── errorHandler.ts
│   ├── config/
│   │   ├── db.ts          # pg Pool setup
│   │   └── env.ts         # Typed env vars
│   └── app.ts             # Express app setup (no listen here)
└── server.ts              # Entry point — app.listen()
```

## Data Flow
```
User Action
  → React Component (renders UI, fires event)
  → Custom Hook (manages state, calls service)
  → Service Layer (builds request, calls API)
  → Express Route → Controller → Service → Model
  → PostgreSQL
  → Model returns rows → Service transforms → Controller sends JSON
  → Service layer receives response → Hook updates state
  → Component re-renders
```

## Decision Rules
| Question | Answer |
|---|---|
| Does this touch the DOM or JSX? | `components/` |
| Is it a full page/route? | `pages/` |
| Does it manage state + call a service? | `hooks/` |
| Does it make HTTP calls? | `services/` (frontend) or `models/` (backend) |
| Is it pure business logic? | `services/` (backend) |
| Is it a shared TypeScript type? | `types/` |
| Is it a pure function with no side effects? | `utils/` |

## Output Format
- Provide the full folder tree as ASCII
- Call out which files are new vs existing
- Flag any cross-cutting concerns that need a shared abstraction
