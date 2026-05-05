-- ============================================================
-- Migration 001 — Property detail columns
-- Run once against an existing database:
--   psql $DATABASE_URL -f src/db/migrate_001_property_details.sql
-- Safe to re-run: every statement uses IF NOT EXISTS / IF EXISTS.
-- ============================================================

-- ── 1. Widen existing CHECK constraints ──────────────────────

-- property_type: add penthouse + builder_floor
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_property_type_check;
ALTER TABLE properties
  ADD CONSTRAINT properties_property_type_check
  CHECK (property_type IN (
    'apartment', 'villa', 'plot', 'commercial',
    'penthouse', 'builder_floor'
  ));

-- status: add pg
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties
  ADD CONSTRAINT properties_status_check
  CHECK (status IN ('for_sale', 'for_rent', 'pg'));

-- ── 2. New columns ────────────────────────────────────────────

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS furnishing      VARCHAR(30)
    CHECK (furnishing IN ('unfurnished', 'semi-furnished', 'fully-furnished'));

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS availability    VARCHAR(30)
    CHECK (availability IN ('ready-to-move', 'under-construction'));

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS age_of_property VARCHAR(50);
  -- e.g. '0-1 year', '1-5 years', '5-10 years', '10+ years'

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS rera_registered BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS rera_number     TEXT;

-- ── 3. Indexes for new filterable columns ─────────────────────

CREATE INDEX IF NOT EXISTS idx_properties_furnishing
  ON properties(furnishing);

CREATE INDEX IF NOT EXISTS idx_properties_availability
  ON properties(availability);

CREATE INDEX IF NOT EXISTS idx_properties_rera
  ON properties(rera_registered) WHERE rera_registered = TRUE;
