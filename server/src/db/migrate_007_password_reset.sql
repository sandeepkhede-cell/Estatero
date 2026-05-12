-- migrate_007_password_reset.sql
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT         NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ  NOT NULL,
  used       BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prt_token   ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id);
