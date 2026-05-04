# Skill: react-refactor

## Purpose
Refactor CDN-based or monolithic React code into a modular, production-ready Vite + TypeScript project for a 99acres-style real estate platform.

## When to Use
- HTML files using `<script src="https://unpkg.com/react">` CDN links
- Single-file React apps with all components in one file
- Class components that need converting to functional components
- JSX files that need TypeScript migration

## Tech Stack
- **Bundler**: Vite
- **Language**: TypeScript (strict mode)
- **UI**: React 18 + functional components + hooks
- **Routing**: React Router v6 (BrowserRouter)
- **Styling**: Tailwind CSS utility classes (preserve existing class names)
- **State**: useState, useEffect, useContext (no Redux unless already present)

## Folder Structure to Enforce
```
src/
├── components/        # Reusable UI pieces (Button, Card, Modal, etc.)
│   ├── common/        # Shared across pages (Navbar, Footer, Loader)
│   └── property/      # Domain-specific (PropertyCard, PropertyGrid, etc.)
├── pages/             # Route-level components (Home, Search, Detail, etc.)
├── services/          # API call functions (propertyService.ts, authService.ts)
├── hooks/             # Custom hooks (useProperties, useSearch, useAuth)
├── types/             # TypeScript interfaces and types (property.ts, user.ts)
├── utils/             # Pure helper functions (formatPrice, parseFilters)
├── context/           # React context providers (AuthContext, FilterContext)
└── assets/            # Static images, icons
```

## Refactor Rules
1. **One section at a time** — never convert the full file in a single pass
2. **Preserve UI exactly** — pixel-perfect match to original; no layout changes
3. **Named exports** for components, default export only for pages
4. **Props must be typed** — define an interface for every component's props
5. **No inline styles** — convert to Tailwind classes or CSS modules
6. **No `any` types** — use proper TypeScript types throughout
7. **Hooks at top level** — never call hooks inside conditionals or loops

## Step-by-Step Process
1. Identify all components in the monolithic file
2. Create the folder structure
3. Extract types/interfaces into `src/types/`
4. Extract utility functions into `src/utils/`
5. Convert leaf components first (no children dependencies)
6. Convert parent/layout components last
7. Set up routing in `App.tsx` with React Router v6
8. Wire up services layer

## TypeScript Conventions
```ts
// Property interface example
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'sale' | 'rent';
  bedrooms: number;
  area: number;
  images: string[];
  postedAt: string;
}

// Component props
interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
}
```

## Output Format
- Provide each new file separately with its full path
- Show only the files being created/modified in this step
- Include import statements at the top of every file
- End each step with: "Next: [what to convert next]"
