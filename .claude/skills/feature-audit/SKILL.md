# Skill: feature-audit

## Purpose
Audit every core feature of the Estatero platform. Read the actual source files, trace data flow from DB → API → frontend, and produce a prioritised checklist of what is working, what is broken, and what is missing. No fixes — diagnosis only.

## How to Run This Audit

Work through each feature area below in order. For each feature:
1. Read the relevant source files listed under "Check files"
2. Trace the full data path (DB schema → controller → service → component)
3. Look for the failure patterns listed in the checklist
4. Mark status: ✅ Working | ❌ Broken | ⚠️ Partial | 🔲 Not implemented

Output a single consolidated report at the end using the format below.

---

## Feature Areas

### 1. Authentication
**Check files:**
- `server/src/controllers/authController.ts`
- `server/src/routes/auth.ts`
- `client/src/components/ui/AuthModal.tsx`
- `client/src/context/AuthContext.tsx`
- `client/src/services/authService.ts`
- `client/src/pages/ForgotPasswordPage/index.tsx`
- `client/src/pages/ResetPasswordPage/index.tsx`

**Verify:**
- [ ] Login with email + password returns JWT and user object
- [ ] Register accepts name/email/password/role (buyer|agent|owner|builder)
- [ ] Role is persisted in JWT and `user.role` in AuthContext
- [ ] Forgot password page exists and hits `POST /api/auth/forgot-password`
- [ ] Reset password page reads token from URL and hits `POST /api/auth/reset-password`
- [ ] Logout clears token from localStorage and resets context
- [ ] Protected pages gate on `authLoading` before opening login modal (no false flash on refresh)

---

### 2. Listings Page & Filters
**Check files:**
- `client/src/pages/ListingsPage/index.tsx`
- `client/src/hooks/useFilters.ts`
- `client/src/components/listings/SidebarFilters.tsx`
- `client/src/components/listings/FilterBar.tsx`
- `client/src/components/listings/PriceRangeFilter.tsx`
- `client/src/components/listings/PostedByFilter.tsx`
- `server/src/models/propertyModel.ts` (findProperties)

**Verify:**
- [ ] City search navigates to `/listings?city=X`
- [ ] Min/max price filters apply atomically (no stale closure overwrite)
- [ ] Property type filter (flat/villa/plot/commercial/pg) works
- [ ] Status filter (for_sale/for_rent/pg) works
- [ ] postedBy filter uses `u.role` column (not agency_name)
- [ ] Amenities filter works
- [ ] Sort by newest/price_asc/price_desc works
- [ ] Pagination (page param) works and total count is correct
- [ ] countSQL has the same JOINs as dataSQL (no "missing FROM-clause" error)
- [ ] Filters persist in URL on page refresh
- [ ] "Clear all" resets all filters

---

### 3. Property Detail Page
**Check files:**
- `client/src/pages/DetailPage/index.tsx`
- `client/src/components/detail/AgentCard.tsx`
- `client/src/components/detail/BottomActionBar.tsx`
- `client/src/components/detail/ContactModal.tsx`
- `client/src/components/detail/EmiCalculator.tsx`
- `server/src/models/propertyModel.ts` (findPropertyById)

**Verify:**
- [ ] Page loads with full property data (images, price, area, bedrooms)
- [ ] AgentCard shows initials fallback when no profile_image (onError swap pattern)
- [ ] AgentCard shows role label (Real Estate Agent / Property Owner / Developer / Builder)
- [ ] AgentCard phone button hidden / shows `phone_disabled` icon when no phone
- [ ] Sidebar CTA: "Contact Agent" reveals phone when phone exists
- [ ] Sidebar CTA: shows "Send Enquiry" directly when no phone
- [ ] BottomActionBar (mobile) handles no-phone case — shows "Send Enquiry" not broken button
- [ ] "Send Inquiry" opens ContactModal and submits to `POST /api/agents/:id/contact`
- [ ] View count increments on page load
- [ ] EMI calculator renders and computes correctly
- [ ] Similar properties section renders
- [ ] Breadcrumb renders city/location links correctly
- [ ] Save (favourite) button works and persists

---

### 4. Post Property
**Check files:**
- `client/src/pages/PostPropertyPage/index.tsx`
- `server/src/routes/properties.ts`
- `server/src/controllers/propertyController.ts`
- `server/src/middleware/auth.ts` (requireRole)

**Verify:**
- [ ] "Post Property" button hidden for buyers in Header (`user?.role !== 'buyer'` check)
- [ ] "Post Property" button hidden for buyers in ProfilePage (`canPost(role)` check)
- [ ] Route `POST /api/properties` is guarded by `requireRole('agent','owner','builder')`
- [ ] Buyers hitting the route get 403
- [ ] Form submits correctly and creates a property visible in listings
- [ ] Image upload works and URLs are stored

---

### 5. Profile Page — Posting Roles (Agent / Owner / Builder)
**Check files:**
- `client/src/pages/ProfilePage/index.tsx`
- `client/src/services/agentService.ts`
- `client/src/services/propertyService.ts`

**Verify:**
- [ ] Default tab is "My Listings" for posting roles
- [ ] "My Listings" tab shows correct properties
- [ ] Edit listing modal updates price/type/status/furnishing
- [ ] Delete listing works with confirmation step
- [ ] Role profile section (Agent/Owner/Builder) renders with correct labels per `ROLE_PROFILE_LABELS`
- [ ] Agent avatar upload works
- [ ] Bio / agency name / RERA number save and reload
- [ ] Enquiries tab shows received inquiries with unread count badge (primary colour)
- [ ] Unread cards show primary-coloured border/background + "New" pill
- [ ] Clicking a card expands the thread and marks it read
- [ ] Agent can send a reply in the thread; message appears immediately
- [ ] Open thread auto-refreshes when buyer sends a follow-up (no need to close/reopen)
- [ ] 10s poll refreshes inquiry list and updates unread badge

---

### 6. Profile Page — Buyer
**Check files:**
- `client/src/pages/ProfilePage/index.tsx`
- `client/src/services/inquiryService.ts` (getSent)

**Verify:**
- [ ] "My Listings" tab is hidden for buyers
- [ ] Default tab is "Saved" (lazy `useState` init uses `canPost`)
- [ ] Saved properties tab shows saved properties
- [ ] "My Enquiries" tab shows sent inquiries with count
- [ ] Counter badge shows number of inquiries with unseen replies (primary colour)
- [ ] Counter correctly updates for 2nd+ replies on same thread (`seenReplies` uses `replied_at` not just ID)
- [ ] Counter clears only when buyer opens the enquiries tab (not on every poll tick)
- [ ] Inquiry card matches agent card layout: avatar circle, property title, location sub-line, responder name
- [ ] Clicking expands thread with chat bubbles (buyer = right/primary, agent = left/gray)
- [ ] Buyer can send follow-up message in thread
- [ ] "New Reply" badge + primary highlight clears after opening the enquiries tab
- [ ] "View Property" link in compose footer navigates correctly
- [ ] 10s poll refreshes sent inquiries

---

### 7. Inquiry Thread (shared)
**Check files:**
- `server/src/controllers/inquiryController.ts`
- `server/src/routes/inquiries.ts`
- `client/src/services/inquiryService.ts`
- DB: `inquiry_messages` table (migrate_009)

**Verify:**
- [ ] `GET /api/inquiries/:id/messages` returns messages in chronological order
- [ ] Auth: agent can read if they own the listing; buyer can read if their email matches `sender_email`
- [ ] `POST /api/inquiries/:id/messages` inserts with correct `sender_type` (determined server-side, never trusted from client)
- [ ] Agent sending → `reply_message` + `replied_at` on inquiry updated, `is_read = TRUE`
- [ ] Buyer sending → `is_read = FALSE` set on inquiry (re-alerts agent)
- [ ] `inquiry_messages` table exists (migrate_009 applied)
- [ ] New inquiry creation (`saveContactInquiry`) also inserts initial message to `inquiry_messages`

---

### 8. Agents Directory
**Check files:**
- `client/src/pages/AgentsPage/index.tsx`
- `client/src/pages/AgentProfilePage/index.tsx`
- `server/src/routes/agents.ts`
- `server/src/controllers/agentController.ts`

**Verify:**
- [ ] `/agents` page lists agents with rating, listing count, avatar
- [ ] Avatar `onError` falls back to initials (same pattern as AgentCard)
- [ ] Agent profile page (`/agent/:id`) loads with listings and bio
- [ ] Rating displayed correctly (1 decimal place, star widget)
- [ ] Logged-in user can rate an agent (1–5 stars)

---

### 9. Saved / Favourites
**Check files:**
- `client/src/hooks/useFavourites.ts`
- `client/src/hooks/useSavedProperties.ts`
- `server/src/routes/favourites.ts`
- `server/src/controllers/favouriteController.ts`

**Verify:**
- [ ] Tapping heart on PropertyCard toggles save state
- [ ] Save persists to DB (not just local state) for logged-in users
- [ ] `/saved` route and Profile "Saved" tab show the same list
- [ ] Removing a save is reflected immediately in the UI

---

### 10. Property Comparison
**Check files:**
- `client/src/components/ui/CompareBar.tsx`
- `client/src/context/CompareContext.tsx`
- `client/src/pages/ComparePage/index.tsx`

**Verify:**
- [ ] Up to 3 properties can be selected for comparison
- [ ] Floating CompareBar appears when ≥1 selected, shows empty slot placeholders
- [ ] "Compare Now" button disabled until ≥2 selected
- [ ] Compare page shows side-by-side table with highlighted differences
- [ ] Removing a property from compare works (× button in bar and toggle in table header)

---

### 11. Role-Based Access Control
**Check files:**
- `server/src/middleware/auth.ts`
- `server/src/routes/properties.ts`
- `server/src/db/migrate_010_drop_seller_role.sql`

**Verify:**
- [ ] `users.role` CHECK allows exactly: buyer | agent | owner | builder (no 'seller')
- [ ] `requireRole` middleware returns 403 for wrong roles
- [ ] Buyer cannot POST /api/properties (gets 403)
- [ ] Buyer cannot access agent-only inquiry endpoints
- [ ] Owner and builder can post and manage properties

---

## Output Format

Produce a report using this exact structure:

```
## Estatero Feature Audit — [date]

### Summary
- ✅ Working: X features
- ❌ Broken: X features
- ⚠️ Partial: X features
- 🔲 Not implemented: X features

---

### ✅ Working
| Feature | Notes |
|---|---|
| Login / Register | Role selection, JWT, logout all work |
| ... | ... |

### ❌ Broken
| Feature | Root Cause | File:Line |
|---|---|---|
| Feature name | Why it's broken | path/to/file.ts:42 |
| ... | ... | ... |

### ⚠️ Partial
| Feature | What works | What's missing |
|---|---|---|
| ... | ... | ... |

### 🔲 Not Implemented
| Feature | Notes |
|---|---|
| ... | ... |

---

### Priority Fix List
1. [Highest impact broken item] — one line on what to fix
2. ...
```

## Rules
- Read actual source files — do NOT guess or assume based on memory
- If a file doesn't exist, mark the whole feature as 🔲
- If a file exists but the feature has obvious bugs (null deref, missing route, wrong column), mark ❌ with the specific file:line
- Keep each table row to one line — details go in the Priority Fix List
- Do NOT make any code changes during the audit
