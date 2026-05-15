import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';

const router = Router();

router.get('/stats', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const { rows } = await pool.query<{
      total_views: string;
      total_enquiries: string;
      replied_enquiries: string;
      avg_response_hours: string | null;
      total_listings: string;
    }>(
      `SELECT
         COALESCE(SUM(p.view_count), 0)            AS total_views,
         COUNT(DISTINCT i.id)                       AS total_enquiries,
         COUNT(DISTINCT i.id) FILTER (WHERE i.replied_at IS NOT NULL) AS replied_enquiries,
         ROUND(
           AVG(EXTRACT(EPOCH FROM (i.replied_at - i.created_at)) / 3600.0)
           FILTER (WHERE i.replied_at IS NOT NULL)
         )                                          AS avg_response_hours,
         COUNT(DISTINCT p.id)                       AS total_listings
       FROM agents ag
       LEFT JOIN properties p  ON p.agent_id = ag.id
       LEFT JOIN inquiries  i  ON i.property_id = p.id
       WHERE ag.user_id = $1`,
      [userId],
    );

    const r = rows[0] ?? {};
    const totalEnquiries  = Number(r.total_enquiries  ?? 0);
    const repliedEnquiries = Number(r.replied_enquiries ?? 0);

    res.json({
      totalViews:       Number(r.total_views   ?? 0),
      totalListings:    Number(r.total_listings ?? 0),
      totalEnquiries,
      responseRate:     totalEnquiries > 0 ? Math.round((repliedEnquiries / totalEnquiries) * 100) : null,
      avgResponseHours: r.avg_response_hours ? Number(r.avg_response_hours) : null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
