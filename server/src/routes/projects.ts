import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';

const router = Router();

// GET /api/projects/mine — builder's own projects
router.get('/mine', requireAuth, requireRole('builder'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rows: agentRows } = await pool.query<{ id: number }>(
      `SELECT id FROM agents WHERE user_id = $1`, [req.user!.userId]
    );
    if (!agentRows[0]) { res.json([]); return; }
    const { rows } = await pool.query(
      `SELECT p.*, COUNT(DISTINCT pr.id) AS property_count
       FROM projects p
       LEFT JOIN properties pr ON pr.project_id = p.id
       WHERE p.builder_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [agentRows[0].id],
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/projects — create a project
router.post('/', requireAuth, requireRole('builder'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, location, city, image, status } =
      req.body as { name: string; description?: string; location?: string; city?: string; image?: string; status?: string };

    if (!name?.trim()) { res.status(400).json({ error: 'name is required' }); return; }

    const { rows: agentRows } = await pool.query<{ id: number }>(
      `SELECT id FROM agents WHERE user_id = $1`, [req.user!.userId]
    );
    if (!agentRows[0]) { res.status(400).json({ error: 'Agent profile not found' }); return; }

    const { rows } = await pool.query(
      `INSERT INTO projects (builder_id, name, description, location, city, image, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [agentRows[0].id, name.trim(), description ?? null, location ?? null, city ?? null, image ?? null, status ?? 'ongoing'],
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PATCH /api/projects/:id
router.patch('/:id', requireAuth, requireRole('builder'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const { name, description, location, city, image, status } =
      req.body as { name?: string; description?: string; location?: string; city?: string; image?: string; status?: string };

    const { rows: agentRows } = await pool.query<{ id: number }>(
      `SELECT id FROM agents WHERE user_id = $1`, [req.user!.userId]
    );
    if (!agentRows[0]) { res.status(403).json({ error: 'Forbidden' }); return; }

    const { rows } = await pool.query(
      `UPDATE projects SET
         name        = COALESCE($1, name),
         description = COALESCE($2, description),
         location    = COALESCE($3, location),
         city        = COALESCE($4, city),
         image       = COALESCE($5, image),
         status      = COALESCE($6, status),
         updated_at  = NOW()
       WHERE id = $7 AND builder_id = $8
       RETURNING *`,
      [name ?? null, description ?? null, location ?? null, city ?? null, image ?? null, status ?? null, projectId, agentRows[0].id],
    );
    if (!rows[0]) { res.status(404).json({ error: 'Project not found' }); return; }
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, requireRole('builder'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const { rows: agentRows } = await pool.query<{ id: number }>(
      `SELECT id FROM agents WHERE user_id = $1`, [req.user!.userId]
    );
    if (!agentRows[0]) { res.status(403).json({ error: 'Forbidden' }); return; }

    const { rowCount } = await pool.query(
      `DELETE FROM projects WHERE id = $1 AND builder_id = $2`,
      [projectId, agentRows[0].id],
    );
    if (!rowCount) { res.status(404).json({ error: 'Project not found' }); return; }
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
