-- ============================================================
-- Estatero — PostgreSQL Schema
-- Run: psql $DATABASE_URL -f src/db/schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- trigram search on location/title

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash TEXT          NOT NULL,
  phone         VARCHAR(20),
  role          VARCHAR(20)   NOT NULL DEFAULT 'buyer'
                              CHECK (role IN ('buyer', 'seller', 'agent')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AGENTS  (extends users 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS agents (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER       UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  agency_name    VARCHAR(255),
  license_number VARCHAR(100),
  bio            TEXT,
  profile_image  TEXT,
  rating         NUMERIC(3,2)  NOT NULL DEFAULT 0.00,
  listings_count INTEGER       NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(500)  NOT NULL,
  description    TEXT,

  -- Pricing
  price          BIGINT        NOT NULL,   -- stored in rupees (₹)
  price_per_sqft INTEGER,
  emi            INTEGER,                  -- estimated monthly EMI

  -- Location
  location       TEXT          NOT NULL,   -- full address / locality string
  city           VARCHAR(100)  NOT NULL,
  state          VARCHAR(100),
  latitude       DECIMAL(10,8),
  longitude      DECIMAL(11,8),

  -- Classification
  property_type  VARCHAR(50)   NOT NULL
                               CHECK (property_type IN (
                                 'apartment','villa','plot','commercial',
                                 'penthouse','builder_floor'
                               )),
  status         VARCHAR(20)   NOT NULL DEFAULT 'for_sale'
                               CHECK (status IN ('for_sale','for_rent','pg')),
  bedrooms       SMALLINT,
  bathrooms      SMALLINT,
  area_sqft      INTEGER,
  floor          SMALLINT,
  total_floors   SMALLINT,
  facing         VARCHAR(30),  -- 'East', 'North-East', etc.

  -- Property details
  furnishing     VARCHAR(30)   CHECK (furnishing IN (
                                 'unfurnished','semi-furnished','fully-furnished'
                               )),
  availability   VARCHAR(30)   CHECK (availability IN (
                                 'ready-to-move','under-construction'
                               )),
  age_of_property VARCHAR(50),             -- '0-1 year','1-5 years','5-10 years','10+ years'
  rera_registered BOOLEAN      NOT NULL DEFAULT FALSE,
  rera_number    TEXT,

  -- Display
  badge          VARCHAR(100),
  badge_variant  VARCHAR(20)   DEFAULT 'primary'
                               CHECK (badge_variant IN ('primary','secondary')),
  is_verified    BOOLEAN       NOT NULL DEFAULT FALSE,
  is_featured    BOOLEAN       NOT NULL DEFAULT FALSE,
  listing_status VARCHAR(20)   NOT NULL DEFAULT 'active'
                               CHECK (listing_status IN ('active','sold','rented','paused')),

  agent_id       INTEGER       REFERENCES agents(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROPERTY IMAGES  (1:N)
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id          SERIAL PRIMARY KEY,
  property_id INTEGER  NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url         TEXT     NOT NULL,
  is_primary  BOOLEAN  NOT NULL DEFAULT FALSE,
  sort_order  INTEGER  NOT NULL DEFAULT 0
);

-- ============================================================
-- AMENITIES  (lookup)
-- ============================================================
CREATE TABLE IF NOT EXISTS amenities (
  id    SERIAL PRIMARY KEY,
  icon  VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- PROPERTY ↔ AMENITY  (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS property_amenities (
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id  INTEGER NOT NULL REFERENCES amenities(id)  ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- ============================================================
-- NEARBY PLACES  (1:N)
-- ============================================================
CREATE TABLE IF NOT EXISTS nearby_places (
  id          SERIAL PRIMARY KEY,
  property_id INTEGER      NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  icon        VARCHAR(100) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  distance    VARCHAR(50)  NOT NULL   -- e.g. '1.2 km'
);

-- ============================================================
-- FAVOURITES  (users N:M properties)
-- ============================================================
CREATE TABLE IF NOT EXISTS favourites (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  property_id INTEGER     NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, property_id)
);

-- ============================================================
-- INQUIRIES  (contact / send-enquiry form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id           SERIAL PRIMARY KEY,
  agent_id     INTEGER               REFERENCES agents(id) ON DELETE SET NULL,
  property_id  INTEGER               REFERENCES properties(id) ON DELETE SET NULL,
  sender_name  VARCHAR(255),
  sender_email VARCHAR(255),
  sender_phone VARCHAR(30),
  message      TEXT         NOT NULL,
  is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_agent    ON inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_is_read  ON inquiries(is_read) WHERE is_read = FALSE;

-- ============================================================
-- POPULAR SEARCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS popular_searches (
  id         SERIAL PRIMARY KEY,
  query      VARCHAR(255) NOT NULL UNIQUE,
  count      INTEGER      NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_properties_city        ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type        ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status      ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price       ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms    ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_featured    ON properties(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_properties_created     ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_agent        ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_furnishing  ON properties(furnishing);
CREATE INDEX IF NOT EXISTS idx_properties_availability ON properties(availability);
CREATE INDEX IF NOT EXISTS idx_properties_rera         ON properties(rera_registered) WHERE rera_registered = TRUE;
CREATE INDEX IF NOT EXISTS idx_properties_listing_status ON properties(listing_status);
CREATE INDEX IF NOT EXISTS idx_property_images_prop    ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_nearby_places_prop     ON nearby_places(property_id);
CREATE INDEX IF NOT EXISTS idx_favourites_user        ON favourites(user_id);

-- Full-text search index on title + location
CREATE INDEX IF NOT EXISTS idx_properties_search
  ON properties USING GIN (to_tsvector('english', title || ' ' || location || ' ' || city));

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON properties;
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-SYNC agents.listings_count
-- ============================================================
CREATE OR REPLACE FUNCTION sync_agent_listings_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.agent_id IS NOT NULL AND NEW.listing_status = 'active' THEN
      UPDATE agents SET listings_count = listings_count + 1 WHERE id = NEW.agent_id;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.agent_id IS NOT NULL AND OLD.listing_status = 'active' THEN
      UPDATE agents SET listings_count = GREATEST(0, listings_count - 1) WHERE id = OLD.agent_id;
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.agent_id IS NOT NULL AND OLD.listing_status = 'active' THEN
      UPDATE agents SET listings_count = GREATEST(0, listings_count - 1) WHERE id = OLD.agent_id;
    END IF;
    IF NEW.agent_id IS NOT NULL AND NEW.listing_status = 'active' THEN
      UPDATE agents SET listings_count = listings_count + 1 WHERE id = NEW.agent_id;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_agent_listings_count ON properties;
CREATE TRIGGER trg_sync_agent_listings_count
  AFTER INSERT OR DELETE OR UPDATE OF agent_id, listing_status
  ON properties
  FOR EACH ROW EXECUTE FUNCTION sync_agent_listings_count();
