import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, filters, created_at FROM saved_searches WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user!.userId],
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, filters } = req.body as { name?: string; filters: Record<string, unknown> };
    if (!filters || typeof filters !== 'object') {
      res.status(400).json({ error: 'filters object is required' }); return;
    }
    const { rows } = await pool.query(
      `INSERT INTO saved_searches (user_id, name, filters) VALUES ($1, $2, $3)
       RETURNING id, name, filters, created_at`,
      [req.user!.userId, name?.trim() || 'My Search', JSON.stringify(filters)],
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rowCount } = await pool.query(
      `DELETE FROM saved_searches WHERE id = $1 AND user_id = $2`,
      [id, req.user!.userId],
    );
    if (!rowCount) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
