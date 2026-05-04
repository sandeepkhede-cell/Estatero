-- Run once: psql $DATABASE_URL -f src/db/migrate-inquiries.sql
CREATE TABLE IF NOT EXISTS inquiries (
  id          SERIAL PRIMARY KEY,
  agent_id    INTEGER      NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  property_id INTEGER      REFERENCES properties(id) ON DELETE SET NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  sender_phone VARCHAR(50),
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_agent    ON inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON inquiries(property_id);
