import { Response, NextFunction } from 'express';
import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';
import { sendReplyEmail } from '../utils/mailer';

export async function getMyInquiries(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    const { rows } = await pool.query(
      `SELECT
         i.id,
         i.property_id,
         i.agent_id,
         i.sender_name,
         i.sender_email,
         i.sender_phone,
         i.message,
         i.is_read,
         i.reply_message,
         i.replied_at,
         i.created_at,
         p.title   AS property_title,
         p.location AS property_location,
         p.city    AS property_city
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       LEFT JOIN agents     ag ON ag.id = i.agent_id
       WHERE
         ag.user_id = $1
         OR p.agent_id IN (SELECT id FROM agents WHERE user_id = $1)
       ORDER BY i.created_at DESC`,
      [userId],
    );

    const unreadCount = rows.filter((r) => !r.is_read).length;
    res.json({ inquiries: rows, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markInquiryRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId     = req.user!.userId;
    const inquiryId  = parseInt(req.params.id, 10);
    if (isNaN(inquiryId)) { res.status(400).json({ error: 'Invalid inquiry ID' }); return; }

    // Only mark as read if this inquiry belongs to the requesting user's listings/agent profile
    const { rowCount } = await pool.query(
      `UPDATE inquiries i
       SET is_read = TRUE
       FROM properties p
       LEFT JOIN agents ag ON ag.id = p.agent_id
       WHERE i.id = $1
         AND i.property_id = p.id
         AND ag.user_id = $2`,
      [inquiryId, userId],
    );

    if (!rowCount) {
      // Also try matching via inquiry's own agent_id
      const { rowCount: rc2 } = await pool.query(
        `UPDATE inquiries
         SET is_read = TRUE
         WHERE id = $1
           AND agent_id IN (SELECT id FROM agents WHERE user_id = $2)`,
        [inquiryId, userId],
      );
      if (!rc2) { res.status(404).json({ error: 'Inquiry not found' }); return; }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function replyToInquiry(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId    = req.user!.userId;
    const inquiryId = parseInt(req.params.id, 10);
    if (isNaN(inquiryId)) { res.status(400).json({ error: 'Invalid inquiry ID' }); return; }

    const { message } = req.body as { message?: string };
    if (!message?.trim()) { res.status(400).json({ error: 'message is required' }); return; }

    // Verify ownership and fetch data needed for the email in one query
    const { rows } = await pool.query<{
      sender_name:      string | null;
      sender_email:     string | null;
      original_message: string;
      property_title:   string | null;
      agent_name:       string;
      agent_email:      string;
    }>(
      `SELECT
         i.sender_name,
         i.sender_email,
         i.message        AS original_message,
         p.title          AS property_title,
         u.name           AS agent_name,
         u.email          AS agent_email
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       LEFT JOIN agents     ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
       LEFT JOIN users      u  ON u.id  = ag.user_id
       WHERE i.id = $1 AND ag.user_id = $2`,
      [inquiryId, userId],
    );

    if (!rows.length) { res.status(404).json({ error: 'Inquiry not found' }); return; }

    await pool.query(
      `UPDATE inquiries
       SET reply_message = $2, replied_at = NOW(), is_read = TRUE
       WHERE id = $1`,
      [inquiryId, message.trim()],
    );

    const row = rows[0];
    if (row.sender_email) {
      sendReplyEmail({
        to:              row.sender_email,
        toName:          row.sender_name,
        agentName:       row.agent_name,
        agentEmail:      row.agent_email,
        propertyTitle:   row.property_title,
        originalMessage: row.original_message,
        replyMessage:    message.trim(),
      }).catch((err: unknown) => console.error('[mailer]', err));
    }

    res.json({ success: true, repliedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}

export async function getSentInquiries(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    const { rows } = await pool.query(
      `SELECT
         i.id,
         i.property_id,
         i.message,
         i.reply_message,
         i.replied_at,
         i.created_at,
         p.title    AS property_title,
         p.city     AS property_city,
         p.location AS property_location,
         u.name     AS responder_name
       FROM inquiries i
       LEFT JOIN properties p  ON p.id  = i.property_id
       LEFT JOIN agents     ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
       LEFT JOIN users      u  ON u.id  = ag.user_id
       WHERE i.sender_email = (SELECT email FROM users WHERE id = $1)
       ORDER BY i.created_at DESC`,
      [userId],
    );

    res.json({ inquiries: rows });
  } catch (err) {
    next(err);
  }
}

export async function getInquiryMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId    = req.user!.userId;
    const inquiryId = parseInt(req.params.id, 10);
    if (isNaN(inquiryId)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    const { rows: auth } = await pool.query(
      `SELECT i.id
       FROM inquiries i
       LEFT JOIN properties p  ON p.id  = i.property_id
       LEFT JOIN agents     ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
       WHERE i.id = $1
         AND (ag.user_id = $2 OR i.sender_email = (SELECT email FROM users WHERE id = $2))`,
      [inquiryId, userId],
    );
    if (!auth.length) { res.status(404).json({ error: 'Not found' }); return; }

    const { rows } = await pool.query(
      `SELECT id, inquiry_id, sender_type, sender_name, content, created_at
       FROM inquiry_messages
       WHERE inquiry_id = $1
       ORDER BY created_at ASC`,
      [inquiryId],
    );
    res.json({ messages: rows });
  } catch (err) { next(err); }
}

export async function postInquiryMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId    = req.user!.userId;
    const inquiryId = parseInt(req.params.id, 10);
    if (isNaN(inquiryId)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    const { content } = req.body as { content?: string };
    if (!content?.trim()) { res.status(400).json({ error: 'content is required' }); return; }

    const { rows } = await pool.query<{
      is_agent:    boolean;
      sender_name: string | null;
      user_name:   string;
    }>(
      `SELECT
         (ag.user_id = $2)                         AS is_agent,
         i.sender_name,
         (SELECT name FROM users WHERE id = $2)    AS user_name
       FROM inquiries i
       LEFT JOIN properties p  ON p.id  = i.property_id
       LEFT JOIN agents     ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
       WHERE i.id = $1
         AND (ag.user_id = $2 OR i.sender_email = (SELECT email FROM users WHERE id = $2))`,
      [inquiryId, userId],
    );
    if (!rows.length) { res.status(404).json({ error: 'Not found' }); return; }

    const senderType = rows[0].is_agent ? 'agent' : 'buyer';
    const senderName = rows[0].is_agent
      ? rows[0].user_name
      : (rows[0].sender_name ?? rows[0].user_name);

    const { rows: inserted } = await pool.query(
      `INSERT INTO inquiry_messages (inquiry_id, sender_type, sender_name, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, inquiry_id, sender_type, sender_name, content, created_at`,
      [inquiryId, senderType, senderName, content.trim()],
    );

    if (senderType === 'agent') {
      await pool.query(
        `UPDATE inquiries SET reply_message = $2, replied_at = NOW(), is_read = TRUE WHERE id = $1`,
        [inquiryId, content.trim()],
      );
    } else {
      await pool.query(`UPDATE inquiries SET is_read = FALSE WHERE id = $1`, [inquiryId]);
    }

    res.json({ message: inserted[0] });
  } catch (err) { next(err); }
}

export async function getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS count
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       LEFT JOIN agents ag ON ag.id = COALESCE(i.agent_id, p.agent_id)
       WHERE ag.user_id = $1 AND i.is_read = FALSE`,
      [userId],
    );
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (err) {
    next(err);
  }
}
