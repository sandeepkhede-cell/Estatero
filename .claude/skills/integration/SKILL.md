# Skill: integration

## Purpose
Connect the React frontend to the Express backend APIs — replacing mock/hardcoded data with real API calls while keeping the UI completely unchanged.

## When to Use
- A backend API endpoint is ready and needs to be wired to a React component
- A component still uses hardcoded mock data
- Adding loading, error, or empty states to an existing component
- Writing the service layer (fetch/axios functions)

## Tech Stack
- **HTTP client**: axios (preferred) or native fetch
- **Base URL**: read from `import.meta.env.VITE_API_URL`
- **Auth**: JWT stored in `localStorage`, sent as `Authorization: Bearer <token>`
- **State**: React hooks (`useState`, `useEffect`) or custom hooks

## Axios Setup
```ts
// src/services/api.ts — shared axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || err)
);

export default api;
```

## Service Layer Pattern
```ts
// src/services/propertyService.ts
import api from './api';
import type { Property, PropertyFilters, PaginatedResponse } from '../types/property';

export const propertyService = {
  getAll: (filters: PropertyFilters) =>
    api.get<PaginatedResponse<Property>>('/properties', { params: filters }),

  getById: (id: string) =>
    api.get<Property>(`/properties/${id}`),

  create: (data: Partial<Property>) =>
    api.post<Property>('/properties', data),

  update: (id: string, data: Partial<Property>) =>
    api.put<Property>(`/properties/${id}`, data),

  delete: (id: string) =>
    api.delete(`/properties/${id}`),
};
```

## Custom Hook Pattern
```ts
// src/hooks/useProperties.ts
import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import type { Property, PropertyFilters } from '../types/property';

export function useProperties(filters: PropertyFilters) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    propertyService.getAll(filters)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Something went wrong'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}
```

## Component Integration Pattern
```tsx
// Replace this:
const properties = MOCK_PROPERTIES;

// With this:
const { data: properties, loading, error } = useProperties(filters);

if (loading) return <Loader />;
if (error) return <ErrorMessage message={error} />;
if (!properties.length) return <EmptyState message="No properties found" />;
```

## Required UI States
Every data-fetching component must handle all three states:

| State | Component | Behavior |
|---|---|---|
| Loading | `<Loader />` | Skeleton or spinner, same layout dimensions |
| Error | `<ErrorMessage />` | Show error text + retry button |
| Empty | `<EmptyState />` | Friendly message, no crash |

## Environment Variables
```env
# .env
VITE_API_URL=http://localhost:5000/api/v1

# .env.production
VITE_API_URL=https://api.yourapp.com/api/v1
```

## CORS (Backend)
```ts
// server/src/app.ts
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

## Integration Rules
1. **Never skip loading state** — even fast APIs flash; the UI must not pop
2. **Never mutate API response directly** — copy before setting state
3. **Cancel stale requests** — use the `cancelled` flag pattern (see hook above)
4. **Keep UI components data-agnostic** — they receive props, not services
5. **All API calls go through the service layer** — no raw axios in components
6. **Type every API response** — no `any`

## Output Format
- Show the service function, the custom hook, and the updated component
- Only output changed files
- Confirm which mock data was replaced and with which endpoint
