# Estatero — Product Walkthrough

**Estatero** is a full-stack real estate marketplace (99acres-style) built for the Indian market. Buyers search and enquire; agents, owners, and builders post and manage listings.

---

## Table of Contents

1. [User Roles](#1-user-roles)
2. [Pages & Routes](#2-pages--routes)
3. [Feature Walkthrough](#3-feature-walkthrough)
   - [Authentication](#authentication)
   - [Home Page](#home-page)
   - [Property Listings](#property-listings)
   - [Property Detail](#property-detail)
   - [Enquiry & Chat System](#enquiry--chat-system)
   - [Favourites & Comparison](#favourites--comparison)
   - [Profile Dashboard](#profile-dashboard)
   - [Post Property (7-step wizard)](#post-property-7-step-wizard)
   - [Agents Directory](#agents-directory)
   - [Agent Public Profile](#agent-public-profile)
   - [Buyer-specific Features](#buyer-specific-features)
   - [Agent / Owner / Builder Features](#agent--owner--builder-features)
4. [Role Permission Matrix](#4-role-permission-matrix)
5. [API Endpoints](#5-api-endpoints)
6. [Database Schema Summary](#6-database-schema-summary)
7. [Tech Stack](#7-tech-stack)
8. [Running Locally](#8-running-locally)

---

## 1. User Roles

Estatero has four roles. Role is selected at registration and cannot be changed via UI.

| Role | Who | Can Post | Key Extras |
|---|---|---|---|
| **Buyer** | Property seekers | No | Saved searches, viewed history, price-drop alerts |
| **Agent** | Licensed real estate professionals | Yes | RERA validation, verified badge, response rate stats |
| **Owner** | Individual sellers / landlords | Yes | Owner-direct badge auto-applied to all listings |
| **Builder** | Developers / construction firms | Yes | Projects tab, group listings under a named project |

All non-buyer roles get an `agents` profile row on registration, which enables posting properties and receiving enquiries.

---

## 2. Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/listings` | Property search & filter | Public |
| `/property/:id` | Property detail | Public |
| `/saved` | Saved / favourited properties | Authenticated |
| `/profile` | Personal dashboard | Authenticated |
| `/post-property` | List a new property (7-step wizard) | Agent / Owner / Builder |
| `/agents` | Agent directory | Public |
| `/agent/:id` | Agent public profile | Public |
| `/compare` | Side-by-side property comparison | Public |
| `/auth` | Full-screen login / register | Guest only |
| `/forgot-password` | Request password reset | Public |
| `/reset-password` | Set new password via token | Public |

---

## 3. Feature Walkthrough

### Authentication

**Register**
1. Click **Sign In / Register** in the header, or navigate to `/auth`.
2. Switch to the **Create Account** tab.
3. Enter name and email.
4. Choose your role from the 4-tile selector: **Buyer / Owner / Agent / Builder**.
5. Enter and confirm a password (min 8 characters).
6. Submit — you are logged in immediately.

**Login**
- Email + password → JWT stored in `localStorage`.
- The app rehydrates your session on every page refresh via `GET /api/auth/me`.

**Password Reset**
1. Click **Forgot password?** on the login form.
2. Enter your email on `/forgot-password` — a reset link is emailed.
3. Click the link → `/reset-password?token=...` — enter your new password.
4. Tokens expire after 1 hour and are single-use.

---

### Home Page

The home page (`/`) features:

- **Hero section** with a search banner — enter city, property type, and budget to jump straight to filtered listings.
- **Listing type tabs** — switch between For Sale / For Rent / PG before searching.
- **Featured properties** carousel — properties marked `is_featured = true` in the DB.
- **Popular search tags** — click to instant-search common queries.
- **Popular cities** section — one-click city filter.
- **Curated collections** — editorial groupings (e.g. "Ready to Move", "Under ₹50L").

---

### Property Listings

Route: `/listings`

**Filters (all URL-persisted, shareable links)**

| Filter | Type | Notes |
|---|---|---|
| City | Text / autocomplete | Matched case-insensitively |
| Listing type | Dropdown | For Sale / For Rent / PG |
| Budget | Dual slider (min/max) | Raw INR values |
| Property type | Multi-select chips | Apartment, Villa, Plot, Commercial, Penthouse, Builder Floor |
| BHK | Multi-select chips | 1–5+ BHK |
| Furnishing | Multi-select | Unfurnished, Semi, Fully |
| Availability | Radio | Ready to Move / Under Construction |
| Age of property | Dropdown | 0–1 yr, 1–5 yrs, 5–10 yrs, 10+ yrs |
| Posted by | Radio | Owner / Agent / Builder |
| Owner Direct | Toggle | Shows only `is_owner_direct = true` listings |
| Amenities | Multi-select | Gym, Pool, Parking, etc. |

**Sort options** cycle through: Newest → Price ↑ → Price ↓.

**Save Search** (buyers only) — click the bookmark button next to the header to save the current filter set to your profile. Requires login.

**Property cards** show:
- Primary photo with status badges (Verified Agent, Owner Direct, custom badge)
- Price + EMI estimate
- "Part of [Project Name]" tag if linked to a builder project
- Beds / baths / sqft specs
- Favourite (heart) and Compare buttons

---

### Property Detail

Route: `/property/:id`

Sections on the detail page:

1. **Image gallery** — full-bleed carousel with thumbnail strip.
2. **Floating header** — appears on scroll with price + quick-action buttons.
3. **Stat grid** — bedrooms, bathrooms, area, floor.
4. **Key details** — facing, furnishing, availability, age, RERA number.
5. **About section** — full description + mini agent card.
6. **Amenities grid** — icons + labels.
7. **Location section** — static map placeholder + nearby places list (schools, hospitals, metro).
8. **EMI calculator** — interactive: loan amount, interest rate, tenure → monthly EMI.
9. **Similar properties** — carousel of listings in the same city.

**Bottom action bar** (mobile): Contact Agent / Make Enquiry buttons.

Viewing a property is recorded as a **view** (`view_count++` in DB) and saved to **viewed history** in `localStorage`.

---

### Enquiry & Chat System

**Sending an enquiry** (from property detail → Contact modal):
- Name, email, phone, message.
- Unauthenticated users can enquire — their details are captured in the `inquiries` table.
- One row per enquiry; a linked `inquiry_messages` row is created for the first message.

**Thread chat** (from Profile → Enquiries tab):
- Both sides (buyer and agent) see the full message thread.
- Buyer can **follow up** on a sent enquiry.
- Agent can **reply** to received enquiries.
- **Unread badge** on the Enquiries tab updates in real time (10-second polling).
- "New Reply" badge appears on buyer side when an agent replies.
- Agent side shows caller's phone with a **Call Back** link.
- Ctrl+Enter submits a message from the textarea.

---

### Favourites & Comparison

**Favourites (heart button)**
- Tap the heart on any property card or detail page to save it.
- Synced to DB for authenticated users; persisted in `FavouritesContext`.
- Saved tab in Profile and `/saved` page shows all favourites.
- The price at the time of favouriting is stored (`price_at_save`) as the foundation for price-drop alerts.

**Compare (compare icon on cards)**
- Select up to 3 properties from any listings page.
- A floating **Compare Bar** appears at the bottom when ≥1 property is selected.
- Click the bar → `/compare` — side-by-side table of price, specs, amenities, RERA, and more.

---

### Profile Dashboard

Route: `/profile` — tabs vary by role.

#### For Buyers

| Tab | Content |
|---|---|
| **Saved** | Favourited properties with remove button |
| **My Enquiries** | Threads for each enquiry sent; "New Reply" badge |
| **Saved Searches** | Saved filter sets; Apply to re-run; Delete to remove |
| **Viewed History** | Last 50 properties viewed; click to revisit; Clear History button |

#### For Agent / Owner / Builder

| Tab | Content |
|---|---|
| **My Listings** | All posted properties; Edit (price, status, furnishing, availability, description); Delete with inline confirmation |
| **Saved** | Favourited properties |
| **Enquiries** | All enquiries received across all listings; expandable threads; unread badge |
| **Analytics** | Total views, total listings, enquiries received, response rate %, avg reply time |
| **Projects** *(Builder only)* | Create / delete projects; listings count per project |

**Profile card (top)** — edit name and phone number.

**Role Profile card** (agent/owner/builder):
- Upload avatar photo.
- Edit agency name, RERA / license number (validated: must start with `RERA` + 5–20 alphanumeric chars), and bio.
- Shows: rating, active listing count, response rate %, avg reply time.
- ✅ **Verified** green badge if `agents.is_verified = true` (set by admin in DB).

---

### Post Property (7-step wizard)

Route: `/post-property` — requires agent / owner / builder role.

| Step | Fields |
|---|---|
| 1 — Property Type | Apartment / Villa / Plot / Commercial / Penthouse / Builder Floor |
| 2 — Location | Address, city, state with autocomplete suggestions |
| 3 — Details | Bedrooms, bathrooms, area (sqft), floor, total floors, facing, age, furnishing, availability |
| 4 — Pricing | Price (₹), price per sqft, EMI, RERA registration + number |
| 5 — Amenities | Multi-select with icons (Gym, Pool, Lift, Parking, Security, etc.) |
| 6 — Photos | Drag-and-drop / click upload; multiple images; first image is primary |
| 7 — Review | Summary of all entered data before final submission |

On submission:
- Property is created with `listing_status = active`.
- Owner role → `is_owner_direct = true` is automatically set.
- Images are uploaded to `/server/uploads/` via Multer.
- The posting user's agent row is linked as `agent_id`.

---

### Agents Directory

Route: `/agents`

- Search bar filters agents by name or agency name.
- Agent cards show: avatar (initials fallback), name, agency, rating (★), listing count.
- **Verified agents** (is_verified) are sorted to the top.
- Click a card → Agent public profile.

---

### Agent Public Profile

Route: `/agent/:id`

- Banner + avatar with initials fallback.
- **Verified Agent** badge (if verified).
- Stats grid: Listings, Starting from (min price), Response Rate %, Avg Reply time.
- **Star rating** — authenticated users can rate 1–5; average updates live.
- Bio / description.
- All active listings by this agent in a property card grid.

---

### Buyer-specific Features

**Saved Searches**
- On `/listings`, authenticated buyers see a **Save Search** button (bookmark icon, top-right of listing results).
- Saves current filter set (city, type, property types, budget, etc.) with an auto-generated name.
- View, apply, or delete saved searches from Profile → Saved Searches tab.

**Viewed History**
- Every property detail page visit is appended to `estatero_viewed` in `localStorage`.
- Stores: property ID, title, location, price, timestamp.
- Capped at 50 entries (FIFO).
- Profile → Viewed History tab: click any item to revisit; **Clear History** wipes all.

**Price-drop alerts (foundation)**
- `favourites.price_at_save` column stores the property price at the time of favouriting.
- Basis for future UI that surfaces "Price dropped by ₹X since you saved" on the Saved tab.

---

### Agent / Owner / Builder Features

**RERA Validation**
- License number field in the role profile accepts only strings matching `/^RERA[A-Z0-9]{5,20}$/i`.
- Examples: `RERAMH12345`, `RERADL9876543`.
- Invalid format → API returns 400 with a descriptive error.

**Verified Badge**
- Set in DB: `UPDATE agents SET is_verified = TRUE WHERE id = <id>;`
- Once set, a green ✅ "Verified Agent" pill appears on: property cards, AgentProfilePage, ProfilePage role section.
- Verified agents rank higher in the agents directory.

**Owner Direct**
- Any property posted by an `owner` role user automatically gets `is_owner_direct = true`.
- A golden "Owner Direct — No Brokerage" badge appears on the property card.
- Buyers can filter by this on `/listings` (Owner Direct filter section).

**Builder Projects**
- Builders can create named projects (e.g. "Lodha Bellagio") from the **Projects** tab.
- Fields: name, city, description, status (Ongoing / Completed / Upcoming).
- Individual properties can be linked to a project via `project_id`.
- Linked properties show a "Part of [Project Name]" tag on their card.
- Projects tab shows unit count (properties linked to each project).

**Analytics Dashboard**
- Profile → Analytics tab.
- Metrics computed live from the DB:
  - **Total Views** — sum of `view_count` across all your properties.
  - **Total Listings** — count of properties you've posted.
  - **Enquiries Received** — count of inquiries across your properties.
  - **Response Rate** — % of enquiries you've replied to.
  - **Avg Response Time** — average hours from enquiry received to first reply.

---

## 4. Role Permission Matrix

| Feature | Buyer | Owner | Agent | Builder |
|---|---|---|---|---|
| Browse listings | ✅ | ✅ | ✅ | ✅ |
| View property detail | ✅ | ✅ | ✅ | ✅ |
| Favourite properties | ✅ | ✅ | ✅ | ✅ |
| Compare properties | ✅ | ✅ | ✅ | ✅ |
| Send enquiry | ✅ | ✅ | ✅ | ✅ |
| Post property | ❌ | ✅ | ✅ | ✅ |
| Edit / delete own listing | ❌ | ✅ | ✅ | ✅ |
| Receive enquiries | ❌ | ✅ | ✅ | ✅ |
| Analytics dashboard | ❌ | ✅ | ✅ | ✅ |
| Owner-direct badge | ❌ | Auto ✅ | ❌ | ❌ |
| RERA license validation | ❌ | ❌ | ✅ | ✅ |
| Verified badge (admin set) | ❌ | ❌ | ✅ | ✅ |
| Create / manage projects | ❌ | ❌ | ❌ | ✅ |
| Save searches | ✅ | ❌ | ❌ | ❌ |
| Viewed history | ✅ | ❌ | ❌ | ❌ |

---

## 5. API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create account; role in body |
| POST | `/login` | No | Returns JWT + user |
| GET | `/me` | Bearer | Current user from token |
| POST | `/forgot-password` | No | Email reset link |
| POST | `/reset-password` | No | Validate token, set new password |

### Properties — `/api/properties`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | List with filters (city, type, BHK, price, ownerDirect…) |
| GET | `/featured` | No | Featured properties |
| GET | `/search?q=` | No | Full-text search |
| GET | `/:id` | No | Single property |
| POST | `/` | Agent/Owner/Builder | Create listing |
| PUT | `/:id` | Owner of listing | Update listing |
| DELETE | `/:id` | Owner of listing | Delete listing |
| POST | `/:id/enquiry` | No | Send enquiry |
| POST | `/:id/view` | No | Increment view count |

### Agents — `/api/agents`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | List agents (with optional search) |
| GET | `/me` | Bearer | Your agent profile |
| PATCH | `/me` | Bearer | Update profile + RERA validation |
| GET | `/:id` | No | Agent profile + response metrics |
| GET | `/:id/properties` | No | Agent's active listings |
| POST | `/:id/contact` | No | Direct agent message |
| POST | `/:id/rate` | Buyer | Rate 1–5 stars |
| GET | `/:id/my-rating` | Bearer | Your rating for this agent |

### Inquiries — `/api/inquiries`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Agent/Owner/Builder | Enquiries received |
| GET | `/sent` | Buyer | Enquiries sent |
| PATCH | `/:id/read` | Bearer | Mark as read |
| GET | `/:id/messages` | Bearer | Full thread messages |
| POST | `/:id/messages` | Bearer | Send a message |

### Saved Searches — `/api/saved-searches`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Buyer | List saved searches |
| POST | `/` | Buyer | Save a search |
| DELETE | `/:id` | Buyer | Delete a saved search |

### Projects — `/api/projects`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/mine` | Builder | Builder's own projects |
| POST | `/` | Builder | Create a project |
| PATCH | `/:id` | Builder | Update a project |
| DELETE | `/:id` | Builder | Delete a project |

### Analytics — `/api/analytics`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Agent/Owner/Builder | Views, enquiries, response rate, avg reply time |

### Misc
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Bearer | Upload images; returns URL array |
| GET | `/api/search/suggestions?q=` | No | City/locality autocomplete |
| GET | `/api/search/popular` | No | Popular search queries |
| GET | `/api/favourites` | Bearer | User's favourited property IDs |
| POST | `/api/favourites/:id` | Bearer | Add to favourites |
| DELETE | `/api/favourites/:id` | Bearer | Remove from favourites |
| GET | `/api/users/:id` | Bearer | User profile |
| PATCH | `/api/users/:id` | Bearer | Update name/phone |
| GET | `/api/users/:id/properties` | Bearer | Properties posted by user |

---

## 6. Database Schema Summary

### Core Tables

| Table | Purpose |
|---|---|
| `users` | All registered users; `role` enum: buyer/agent/owner/builder |
| `agents` | Profile row for non-buyer users; `is_verified`, `rating`, `listings_count` |
| `properties` | All listings; 30+ columns covering specs, status, RERA, flags |
| `property_images` | One-to-many images per property; `is_primary`, `sort_order` |
| `amenities` | Lookup table: icon + label |
| `property_amenities` | Many-to-many join between properties and amenities |
| `nearby_places` | POIs per property (school, metro, hospital) |
| `favourites` | User ↔ property saves; `price_at_save` for price-drop alerts |
| `inquiries` | One row per enquiry; `is_read`, `replied_at` |
| `inquiry_messages` | Full message thread per inquiry; `sender_type` (buyer/agent) |
| `agent_ratings` | One rating per user per agent; auto-syncs `agents.rating` |
| `password_reset_tokens` | Single-use tokens, 1-hour expiry |
| `popular_searches` | Query counts for homepage tags |
| `projects` | Builder projects; linked to `agents` |
| `saved_searches` | Buyer saved filter sets as JSONB |

### Key Property Columns
| Column | Type | Purpose |
|---|---|---|
| `listing_status` | varchar | active / sold / rented / paused |
| `status` | varchar | for_sale / for_rent / pg |
| `is_verified` | bool | Property-level verification flag |
| `is_featured` | bool | Appears in featured carousel |
| `is_owner_direct` | bool | Owner posted without intermediary |
| `view_count` | int | Incremented on each property view |
| `project_id` | int FK | Links to builder project |
| `rera_number` | text | Registration number |

### Key Agent Columns
| Column | Purpose |
|---|---|
| `is_verified` | Admin-set; enables verified badge |
| `rating` | Auto-synced from `agent_ratings` average |
| `listings_count` | Auto-synced from active properties trigger |

### Auto-sync Triggers
- `agents.listings_count` — updates on property INSERT / UPDATE / DELETE.
- `agents.rating` — updates on agent_ratings INSERT / UPDATE.
- `properties.updated_at` — updates on any property change.

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Routing | React Router v6 |
| State | React Context (Auth, Favourites, Compare, AuthModal) |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 15 (Docker container) |
| Auth | JWT HS256, stored in `localStorage` |
| File uploads | Multer → `/server/uploads/` (served as static) |
| Email | Nodemailer (SMTP env vars) |
| Icons | Google Material Symbols (web font) |

**Frontend structure:**
```
client/src/
  pages/        Route-level pages (one folder per route)
  components/   Shared UI: ui/, listings/, detail/, layout/, home/
  context/      AuthContext, FavouritesContext, CompareContext, AuthModalContext
  hooks/        useFilters, useProperties, useFavourites, useSavedProperties, useComparison
  services/     API clients (one file per domain)
  types/        property.ts, auth.ts, search.ts
  utils/        formatINR, filterParams
```

**Backend structure:**
```
server/src/
  routes/       Express routers (one file per domain)
  controllers/  Route handlers
  models/       DB query functions
  middleware/   requireAuth, requireRole
  db/           migrations (001–012), seeds, schema.sql
  utils/        jwt, password, mailer
  types/        PropertyRow, PropertyDTO, AgentDTO, PropertyFilters
```

---

## 8. Running Locally

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- `.env` files configured (see below)

### 1 — Start the database
```bash
docker run --name condreport_postgres \
  -e POSTGRES_USER=psspl \
  -e POSTGRES_PASSWORD=psspl \
  -e POSTGRES_DB=estatero \
  -p 5432:5432 -d postgres:15
```

Apply migrations in order:
```bash
for f in server/src/db/migrate_*.sql; do
  cat "$f" | docker exec -i condreport_postgres psql -U psspl -d estatero
done
```

Optionally seed sample data:
```bash
cat server/src/db/seed_v3_owner_builder.sql | docker exec -i condreport_postgres psql -U psspl -d estatero
```

### 2 — Backend `.env`
```
DATABASE_URL=postgresql://psspl:psspl@localhost:5432/estatero
JWT_SECRET=your-secret-key
PORT=5000
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email (for password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=no-reply@estatero.com
```

Start the backend:
```bash
cd server
npm install
npm run dev
```

### 3 — Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
cd client
npm install
npm run dev
```

App is available at `http://localhost:5173`.

### 4 — Admin operations (DB direct)
```bash
# Connect to DB
docker exec -it condreport_postgres psql -U psspl -d estatero

# Verify an agent
UPDATE agents SET is_verified = TRUE WHERE id = <agent_id>;

# Feature a property
UPDATE properties SET is_featured = TRUE WHERE id = <property_id>;

# Check all users and roles
SELECT id, name, email, role FROM users ORDER BY created_at DESC;
```

---

## Test Accounts (after seeding)

After running `seed_v3_owner_builder.sql`, the following accounts exist:

| Role | Email | Password |
|---|---|---|
| Agent | agent@test.com | password123 |
| Owner | owner@test.com | password123 |
| Builder | builder@test.com | password123 |
| Buyer | buyer@test.com | password123 |

> Passwords in seeds are pre-hashed bcrypt values. Generate new ones in bash:
> ```bash
> node -e "const b=require('bcrypt');b.hash('password123',10).then(console.log)"
> ```
