# Skill: pr-review

## Purpose
Review code changes on this real estate platform — catching bugs, security issues, performance problems, and deviations from project conventions — before they reach main.

## When to Use
- Before merging any feature branch
- After finishing a task to self-review before committing
- When asked to review a diff, file, or set of changes
- To audit newly added backend routes or frontend pages

---

## Review Dimensions

Evaluate every change across these five dimensions. Report findings grouped by dimension, each item tagged with a severity.

### Severity Scale
| Tag | Meaning |
|---|---|
| 🔴 **BLOCKER** | Must fix before merge — broken functionality, security hole, data loss |
| 🟠 **MAJOR** | Should fix — wrong behaviour, bad UX, likely to cause a future bug |
| 🟡 **MINOR** | Nice to fix — suboptimal but won't break anything |
| 🔵 **NIT** | Trivial style/naming — fix only if it takes < 1 min |

---

## Dimension 1 — Correctness

**Frontend**
- [ ] All async calls handle loading, error, and success states
- [ ] No `useEffect` with missing or wrong dependencies (stale closures)
- [ ] No unchecked array access (`arr[0]` without length guard)
- [ ] Conditional rendering uses correct guard (`&&` vs `??` vs ternary)
- [ ] Form validation runs before submission, not only on blur
- [ ] Navigation after async action waits for it to complete
- [ ] `key` props in lists are stable IDs, not array indexes

**Backend**
- [ ] Every async controller is wrapped in try/catch and calls `next(err)`
- [ ] All user-supplied IDs are parsed with `parseInt` and checked for `isNaN`
- [ ] Required fields are validated before hitting the database
- [ ] `ON CONFLICT` or `WHERE` clauses prevent silent data corruption
- [ ] Sequences (`setval`) are bumped after manual INSERTs with explicit IDs

---

## Dimension 2 — Security

- [ ] No secrets (tokens, passwords, API keys) in source files or logs
- [ ] Auth-required routes use `requireAuth` middleware — not ad-hoc checks inside controllers
- [ ] User can only modify their own resources (check `req.user.userId === resource.userId`)
- [ ] File upload endpoints validate MIME type AND file extension (not just one)
- [ ] File upload size limit enforced (currently 10 MB via multer)
- [ ] Uploaded files saved with random names — not original filename (path traversal risk)
- [ ] SQL uses parameterised queries (`$1, $2`) — no string interpolation with user input
- [ ] `helmet()` is active and no route disables it globally
- [ ] CORS `origin` is an explicit allowlist, not `*` in production
- [ ] JWT secret is from `process.env`, not hardcoded

---

## Dimension 3 — Performance

**Frontend**
- [ ] No fetch calls inside render (must be inside `useEffect` or event handler)
- [ ] `useCallback` / `useMemo` used only when the dependency is actually expensive — not cargo-culted
- [ ] Images have `loading="lazy"` where they appear below the fold
- [ ] List pages are paginated — never render unbounded arrays
- [ ] Filter/search calls are debounced or gated behind a submit action
- [ ] No new npm packages added when a native API or existing dep can do the job

**Backend**
- [ ] No N+1 queries — use JOINs or batch queries
- [ ] New filterable columns have a corresponding index
- [ ] `SELECT *` avoided on large tables — only select needed columns
- [ ] Pagination enforced (`LIMIT`/`OFFSET` always present on list queries)
- [ ] Multer `limits.fileSize` set on every upload route

---

## Dimension 4 — Project Conventions

This project has specific patterns. Flag deviations.

**TypeScript**
- [ ] No `any` — use proper types or `unknown`
- [ ] New DB row types added to `server/src/types/index.ts`
- [ ] New frontend API shapes match what the backend actually returns
- [ ] `interface` preferred over `type` for object shapes

**Currency / Numbers**
- [ ] All prices displayed through `formatINR()` — never raw `.toLocaleString` or manual formatting
- [ ] Prices stored as integers (rupees) in DB — no decimals, no paise unless intentional
- [ ] Price fields for rent/PG listings use monthly rent, not annual

**URL / Filter state**
- [ ] New filters added to both `filtersToParams` AND `paramsToFilters` (they must be symmetric)
- [ ] Status filter values match DB enum: `for_sale` | `for_rent` | `pg`
- [ ] Property type values match DB enum: `apartment` | `villa` | `plot` | `commercial` | `penthouse` | `builder_floor`

**Auth**
- [ ] Gated actions (favourite, post property, contact reveal) check `useAuth()` — not local state
- [ ] Auth-modal opening uses `useAuthModal().open()` — not `navigate('/auth')`
- [ ] Logout clears localStorage token AND resets `user` state in `AuthContext`

**Images**
- [ ] Uploaded images go through `POST /api/upload` — never store blob: URLs in DB
- [ ] Property images reference `property_images` table — not a JSON column on properties

**API**
- [ ] New routes registered in `server/src/index.ts`
- [ ] Protected routes use `requireAuth` from `src/middleware/auth.ts`
- [ ] Controllers delegate SQL to models — no raw `pool.query` inside controllers
- [ ] New static-served directories set `Cross-Origin-Resource-Policy: cross-origin`

**Seed / Migrations**
- [ ] Schema changes go in a new numbered migration file, not directly to `schema.sql`
- [ ] Migrations are idempotent (`IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS`)
- [ ] New columns with `NOT NULL` have a `DEFAULT` or an UPDATE backfill in the migration

---

## Dimension 5 — UX & Accessibility

- [ ] Loading states shown for every async operation (spinner or skeleton)
- [ ] Error states shown with a user-facing message (not just a console.error)
- [ ] Empty states have a helpful message and a call to action
- [ ] Buttons that trigger async work are disabled while in-flight
- [ ] Destructive actions (delete, sign out) require confirmation or are reversible
- [ ] New pages added to `MobileNav` if they're primary destinations
- [ ] New nav links use React Router `<Link to="...">` — not `<a href="...">`
- [ ] Form inputs have `type`, `placeholder`, and visible label or `aria-label`
- [ ] Color contrast: text on coloured backgrounds passes WCAG AA (4.5:1)

---

## Review Workflow

When invoked, follow these steps in order:

1. **Read the diff** — understand what changed and why
2. **Identify the scope** — frontend only, backend only, or full-stack
3. **Run each checklist** relevant to the scope
4. **Report findings** grouped by dimension, each with:
   - Severity tag
   - File + line reference
   - One-sentence explanation of the problem
   - Suggested fix (code snippet if non-obvious)
5. **Give a summary verdict**:
   - ✅ **Approved** — no blockers or majors
   - ⚠️ **Approved with comments** — minors/nits only, can merge
   - ❌ **Needs changes** — has blockers or majors

---

## Output Format

```
## PR Review — [feature name or file list]

### Dimension 1 — Correctness
🔴 BLOCKER · `client/src/pages/PostPropertyPage/index.tsx:87`
  `propertyService.create()` is awaited inside a non-async callback. Promise rejection will be silently swallowed.
  Fix: make the handler `async` and add a try/catch.

🟡 MINOR · `server/src/models/propertyModel.ts:42`
  `SELECT *` on properties table returns unused columns (nearby_places, amenities) on every list query.
  Fix: enumerate only the columns the list view needs.

### Dimension 2 — Security
(none)

### Dimension 3 — Performance
🟠 MAJOR · `client/src/pages/ListingsPage/index.tsx:31`
  Filter state change triggers a new fetch on every keystroke in the search input (no debounce).
  Fix: wrap `load()` call in `useDebouncedCallback(load, 300)` or gate behind form submit.

### Dimension 4 — Project Conventions
🔵 NIT · `client/src/pages/AgentsPage/index.tsx:88`
  Price displayed with `.toLocaleString()` instead of `formatINR()`.
  Fix: import and use `formatINR`.

### Dimension 5 — UX & Accessibility
🟠 MAJOR · `client/src/pages/PostPropertyPage/steps/Step6Photos.tsx`
  Upload button has no disabled state while upload is in-flight. User can click multiple times and create duplicate uploads.
  Fix: disable the drop-zone and file input while `uploading === true`.

---
### Verdict
❌ Needs changes — 1 blocker, 2 majors must be resolved before merge.
```

---

## Project-Specific Red Flags (instant 🔴 BLOCKER)

These patterns are always blockers in this codebase regardless of context:

1. `blob:` URLs stored in `property_images` table
2. Raw SQL string concatenation with user input (SQL injection)
3. Auth check done with `if (!user) return` inside a component instead of redirect/modal
4. `password_hash` field returned in any API response
5. `SELECT *` on `properties` with a JOIN on `property_images` without pagination (can return MBs of data)
6. A route added to `routes/*.ts` but not registered in `index.ts`
7. `setval` not called after a seeded INSERT with explicit integer IDs
