-- inquiry_messages: full chat thread per inquiry
CREATE TABLE IF NOT EXISTS inquiry_messages (
  id          SERIAL PRIMARY KEY,
  inquiry_id  INTEGER NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('buyer', 'agent')),
  sender_name TEXT,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiry_messages_inquiry_id_idx
  ON inquiry_messages(inquiry_id, created_at);

-- Migrate buyer initial messages (skip if already exists for that inquiry)
INSERT INTO inquiry_messages (inquiry_id, sender_type, sender_name, content, created_at)
SELECT id, 'buyer', sender_name, message, created_at
FROM   inquiries
WHERE  message IS NOT NULL
  AND  message <> ''
  AND  NOT EXISTS (
    SELECT 1 FROM inquiry_messages im
    WHERE  im.inquiry_id = inquiries.id AND im.sender_type = 'buyer'
  );

-- Migrate existing single agent replies
INSERT INTO inquiry_messages (inquiry_id, sender_type, sender_name, content, created_at)
SELECT
  i.id,
  'agent',
  u.name,
  i.reply_message,
  COALESCE(i.replied_at, NOW())
FROM inquiries i
LEFT JOIN properties p  ON p.id  = i.property_id
LEFT JOIN agents     ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
LEFT JOIN users      u  ON u.id  = ag.user_id
WHERE i.reply_message IS NOT NULL
  AND i.reply_message <> ''
  AND NOT EXISTS (
    SELECT 1 FROM inquiry_messages im
    WHERE  im.inquiry_id = i.id AND im.sender_type = 'agent'
  );
