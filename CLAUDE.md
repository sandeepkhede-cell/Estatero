# Estatero — AI Development Workflow

99acres-style real estate marketplace built with React + Vite + TypeScript + Tailwind (frontend) and Node.js + Express + PostgreSQL (backend).

## AI Behavior Rules
- **Conciseness**: No preamble, politeness, or "I've updated the file" summaries.
- **Code Only**: Default to providing code blocks only unless explanation is requested.
- **Diff Style**: Use partial code snippets with `// ... existing code` to avoid full file rewrites.
- **TypeScript**: Use strict types; avoid `any`.

## Skills

Use these skills to drive development:

| Skill | Purpose |
|---|---|
| `/react-refactor` | Convert CDN/monolithic React to Vite+TS components |
| `/react-ui` | Create React components (atomic, domain, layout, forms) |
| `/99acres-clone` | Replicate 99acres.com pages, components, and UX patterns |
| `/architecture` | Design folder structure and data flow |
| `/api-design` | Design REST endpoints and Express controllers |
| `/integration` | Wire frontend to backend APIs |
| `/qa-debug` | Fix bugs and UI issues |
| `/pr-review` | Review code changes for bugs, security, performance, and conventions |
| `/feature-audit` | Audit all core features — produces ✅/❌/⚠️/🔲 status report with priority fix list |

## Development Workflow

1. **Step 1 — `/react-refactor`**: Convert HTML mockups into React components
2. **Step 2 — `/architecture`**: Define folder structure and app architecture
3. **Step 3 — `/api-design`**: Build backend APIs and database schema
4. **Step 4 — `/integration`**: Connect frontend with backend
5. **Step 5 — `/qa-debug`**: Fix bugs and optimize performance
6. **Step 6 — `/feature-audit`**: Audit working/broken/partial features before shipping

---

## Architecture Overview

### Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Docker) |
| Auth | JWT (HS256) stored in localStorage |
| File uploads | Multer → `/server/uploads/` |
| Email | Nodemailer (SMTP via env vars) |

### Key Directories
```
client/src/
  pages/          # Route-level components (one folder per page)
  components/     # Shared UI (ui/, listings/, detail/, layout/, home/)
  context/        # AuthContext, AuthModalContext, FavouritesContext, CompareContext
  hooks/          # useFilters, useProperties, useFavourites, useSavedProperties, useComparison
  services/       # API clients (authService, propertyService, agentService, inquiryService, userService)
  types/          # TypeScript types (property.ts, auth.ts, search.ts)
  utils/          # formatINR, filterParams

server/src/
  controllers/    # Express route handlers
  models/         # DB query functions (propertyModel, agentModel)
  routes/         # Express routers
  middleware/     # auth.ts (requireAuth, requireRole)
  db/             # migrations (001–010), seeds, schema.sql
  utils/          # jwt, password, mailer
  types/          # PropertyRow, PropertyDTO, AgentDTO, PropertyFilters
```

### Database Migrations (applied in order)
| File | Purpose |
|---|---|
| `migrate_001` | Property detail columns |
| `migrate_002` | listing_status column |
| `migrate_003` | listings_count trigger |
| `migrate_004` | inquiry reply columns |
| `migrate_005` | agent_ratings table |
| `migrate_006` | view_count column |
| `migrate_007` | password_reset_tokens table |
| `migrate_008` | owner + builder roles added |
| `migrate_009` | inquiry_messages table (full thread chat) |
| `migrate_010` | removed dead 'seller' role from CHECK constraint |

---

## Feature Status (as of 2026-05-12)

All core features are implemented and working. Known-fixed bugs:

| Bug | Fix |
|---|---|
| Buyer profile page defaulted to listings tab | `useState` lazy init uses `canPost(user?.role)` |
| Login modal flashed on page refresh | `authLoading` guard in ProfilePage useEffect |
| AgentsPage avatar broken URL showed browser icon | `onError` swap to initials (matches AgentCard pattern) |
| "seller" role in DB constraint but not in registration | `migrate_010` removed it |
| Inquiry reply counter never updated for 2nd+ replies | `seenReplies` changed from `Set<id>` to `Record<id, replied_at>` |
| `seenReplies` effect fired on every poll tick | Removed `sentInquiries` from dependency array |
| Open thread didn't auto-refresh on new buyer message | useEffect watches `inquiries`, refreshes `threadMap[expandedId]` when `is_read` flips |
| Poll interval was 30s (counter felt invisible) | Reduced to 10s for both agent and buyer |
| Inquiry highlight colours were blue, not brand primary | All `blue-500/blue-400/blue-50` → `primary/primary/primary/5` |

---

## Important Patterns

### Role System
- Valid roles: `buyer` | `agent` | `owner` | `builder`
- `buyer` — can search, save, enquire; cannot post properties
- `agent` / `owner` / `builder` — can post + manage properties; get an `agents` row on register
- `canPost(role)` helper in ProfilePage guards posting UI
- `requireRole('agent','owner','builder')` middleware guards `POST /api/properties`

### Auth Flow
- Register/login → JWT + user object → `localStorage.setItem('token', ...)`
- AuthContext rehydrates on mount via `GET /api/auth/me`
- `authLoading = true` while rehydration is in progress — all protected pages must gate on `authLoading` before redirecting to login

### Inquiry Thread
- `inquiries` table: one row per enquiry, stores `is_read`, `reply_message`, `replied_at`
- `inquiry_messages` table: one row per message, `sender_type` ('buyer'|'agent') set server-side
- Agent receiving new buyer follow-up → server sets `is_read = FALSE` on inquiry
- Buyer "new reply" tracking: `seenReplies: Record<id, replied_at>` in localStorage — new reply detected when `seenReplies[id] < q.replied_at`
- Both sides poll every 10s; open thread auto-refreshes when `is_read` flips back to false

### Filters (URL-persisted)
- All filter state lives in URL search params via `useFilters` + `useSearchParams`
- `updateFilter(key, value)` resets page to 1 for all keys except `page`
- `clearAll()` resets to `DEFAULT_FILTERS`
- `countSQL` must always have the same JOINs as `dataSQL` to avoid "missing FROM-clause" errors

### DB Conventions
- Always run `psql` via `docker exec condreport_postgres psql -U psspl -d estatero`
- `GROUP BY` clauses must list all non-aggregated SELECT columns: `p.id, u.name, u.phone, u.role, ag.bio, ag.profile_image`
- bcrypt hashes must be generated in bash (not PowerShell) to avoid `$` interpolation corruption
