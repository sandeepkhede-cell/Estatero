-- ============================================================
-- Migration 002 — Listing lifecycle status
-- Run once: psql $DATABASE_URL -f src/db/migrate_002_listing_status.sql
-- Safe to re-run: uses IF NOT EXISTS.
-- ============================================================

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS listing_status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (listing_status IN ('active', 'sold', 'rented', 'paused'));

CREATE INDEX IF NOT EXISTS idx_properties_listing_status
  ON properties(listing_status);
