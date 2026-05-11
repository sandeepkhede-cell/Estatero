-- migrate_006_view_count.sql
ALTER TABLE properties ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_properties_view_count ON properties(view_count DESC);
