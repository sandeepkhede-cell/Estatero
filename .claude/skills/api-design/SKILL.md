# Skill: api-design

## Purpose
Design and implement RESTful backend APIs for a 99acres-style real estate platform using Node.js + Express + PostgreSQL.

## When to Use
- Adding a new backend feature (property listing, search, auth, etc.)
- Designing a new REST endpoint from scratch
- Writing Express controllers and route handlers
- Designing or updating the PostgreSQL schema

## Tech Stack
- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Database**: PostgreSQL 15 via `pg` (node-postgres) — no ORM
- **Auth**: JWT (jsonwebtoken) + bcrypt for password hashing
- **Validation**: zod for request body validation
- **Environment**: dotenv + typed config

## REST Conventions
- **Base URL**: `/api/v1`
- **Naming**: plural nouns — `/properties`, `/users`, `/locations`
- **HTTP verbs**: GET (read), POST (create), PUT (full update), PATCH (partial), DELETE
- **Response envelope**:
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message",
  "pagination": { "page": 1, "limit": 20, "total": 150 }
}
```
- **Error envelope**:
```json
{
  "success": false,
  "error": "PROPERTY_NOT_FOUND",
  "message": "No property found with id 42"
}
```

## Core Endpoints

### Properties
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/properties` | List with filters + pagination |
| GET | `/api/v1/properties/:id` | Single property detail |
| POST | `/api/v1/properties` | Create listing (auth required) |
| PUT | `/api/v1/properties/:id` | Update listing (owner only) |
| DELETE | `/api/v1/properties/:id` | Delete listing (owner only) |
| GET | `/api/v1/properties/search` | Full-text + filter search |

### Query Parameters for Search
```
GET /api/v1/properties?
  city=Mumbai
  &type=sale|rent
  &propertyType=apartment|villa|plot|commercial
  &minPrice=5000000
  &maxPrice=20000000
  &bedrooms=2,3
  &minArea=800
  &maxArea=2000
  &page=1
  &limit=20
  &sortBy=price|postedAt|area
  &sortOrder=asc|desc
```

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| POST | `/api/v1/auth/logout` | Invalidate token |
| GET | `/api/v1/auth/me` | Get current user (auth required) |

### Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/users/:id` | Public profile |
| PATCH | `/api/v1/users/:id` | Update profile (self only) |
| GET | `/api/v1/users/:id/properties` | Listings by user |

## PostgreSQL Schema

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user',  -- 'user' | 'agent' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(12, 2) NOT NULL,
  listing_type    TEXT NOT NULL,       -- 'sale' | 'rent'
  property_type   TEXT NOT NULL,       -- 'apartment' | 'villa' | 'plot' | 'commercial'
  bedrooms        INT,
  bathrooms       INT,
  area_sqft       NUMERIC(10, 2),
  city            TEXT NOT NULL,
  locality        TEXT,
  address         TEXT,
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),
  images          TEXT[],              -- array of image URLs
  amenities       TEXT[],
  status          TEXT DEFAULT 'active',  -- 'active' | 'sold' | 'inactive'
  posted_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_user ON properties(user_id);
```

## Controller Pattern
```ts
// controllers/propertyController.ts
export const getProperties = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req.query);
    const { data, total } = await propertyService.findAll(filters);
    res.json({ success: true, data, pagination: { ...filters.pagination, total } });
  } catch (err) {
    next(err);
  }
};
```

## Middleware Stack
1. `cors()` — allow frontend origin
2. `express.json()` — parse body
3. `morgan` — request logging
4. Route handlers
5. `errorHandler` — catch-all error middleware (last)

## Rules
- Controllers must not contain SQL — delegate to models
- Services must not import `req` or `res`
- All routes validated with zod before reaching controller
- Auth middleware applied at router level, not per-route

## Output Format
- Provide route file, controller, service, and model for each feature
- Include the SQL migration as a `.sql` file
- Show example request + response for each endpoint
