-- 011: agent verified badge, builder projects, owner-direct flag

-- Verified badge on agents (admin sets this)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Owner-direct flag on properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_owner_direct BOOLEAN DEFAULT FALSE;

-- Builder projects table
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  builder_id  INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  location    TEXT,
  city        VARCHAR(100),
  image       TEXT,
  status      VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'upcoming')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_builder ON projects(builder_id);

-- Link properties to a builder project (optional)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
