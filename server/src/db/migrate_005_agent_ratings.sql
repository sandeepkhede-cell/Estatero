-- migrate_005_agent_ratings.sql
-- One rating per user per agent; agents.rating = live average.

CREATE TABLE IF NOT EXISTS agent_ratings (
  id         SERIAL PRIMARY KEY,
  agent_id   INTEGER  NOT NULL REFERENCES agents(id)  ON DELETE CASCADE,
  user_id    INTEGER  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_ratings_agent ON agent_ratings(agent_id);

-- Trigger: keep agents.rating in sync after every insert / update / delete
CREATE OR REPLACE FUNCTION sync_agent_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  target_agent INTEGER;
BEGIN
  target_agent := COALESCE(NEW.agent_id, OLD.agent_id);
  UPDATE agents
  SET rating = COALESCE(
    (SELECT ROUND(AVG(rating)::numeric, 2) FROM agent_ratings WHERE agent_id = target_agent),
    0
  )
  WHERE id = target_agent;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_agent_rating ON agent_ratings;
CREATE TRIGGER trg_sync_agent_rating
AFTER INSERT OR UPDATE OR DELETE ON agent_ratings
FOR EACH ROW EXECUTE FUNCTION sync_agent_rating();
