-- 012: saved searches + price-at-save tracking for price-drop alerts

CREATE TABLE IF NOT EXISTS saved_searches (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL DEFAULT 'My Search',
  filters    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- Track property price at the time of favouriting, used for price-drop alerts
ALTER TABLE favourites ADD COLUMN IF NOT EXISTS price_at_save BIGINT;

-- Backfill price_at_save for existing favourites
UPDATE favourites f
SET price_at_save = p.price
FROM properties p
WHERE f.property_id = p.id AND f.price_at_save IS NULL;
