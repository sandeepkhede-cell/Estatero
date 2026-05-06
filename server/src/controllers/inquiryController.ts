import { Response, NextFunction } from 'express';
import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';

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
