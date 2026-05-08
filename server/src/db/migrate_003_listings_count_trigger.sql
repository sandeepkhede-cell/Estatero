-- ============================================================
-- Migration 003 — Auto-sync agents.listings_count via trigger
-- Run once: psql $DATABASE_URL -f src/db/migrate_003_listings_count_trigger.sql
-- Safe to re-run: uses CREATE OR REPLACE / DROP IF EXISTS.
-- ============================================================

-- ── Trigger function ──────────────────────────────────────────────────────────
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
    -- Decrement from old agent / old status
    IF OLD.agent_id IS NOT NULL AND OLD.listing_status = 'active' THEN
      UPDATE agents SET listings_count = GREATEST(0, listings_count - 1) WHERE id = OLD.agent_id;
    END IF;
    -- Increment for new agent / new status
    IF NEW.agent_id IS NOT NULL AND NEW.listing_status = 'active' THEN
      UPDATE agents SET listings_count = listings_count + 1 WHERE id = NEW.agent_id;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ── Attach trigger (fires only when agent_id or listing_status changes) ────────
DROP TRIGGER IF EXISTS trg_sync_agent_listings_count ON properties;
CREATE TRIGGER trg_sync_agent_listings_count
  AFTER INSERT OR DELETE OR UPDATE OF agent_id, listing_status
  ON properties
  FOR EACH ROW EXECUTE FUNCTION sync_agent_listings_count();

-- ── One-time backfill to correct existing stale counts ────────────────────────
UPDATE agents a
SET listings_count = (
  SELECT COUNT(*)
  FROM properties p
  WHERE p.agent_id = a.id
    AND p.listing_status = 'active'
);
