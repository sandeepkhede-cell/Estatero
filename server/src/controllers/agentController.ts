import { Request, Response, NextFunction } from 'express';
import * as agentModel from '../models/agentModel';
import { findPropertiesByAgentId } from '../models/propertyModel';
import { AuthRequest } from '../middleware/auth';

export async function getAllAgents(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const agents = await agentModel.findAllAgents(search);
    res.json({ agents, total: agents.length });
  } catch (err) {
    next(err);
  }
}

export async function getAgentById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    const agent = await agentModel.findAgentById(id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    res.json(agent);
  } catch (err) {
    next(err);
  }
}

export async function getAgentProperties(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid agent ID' }); return; }
    const properties = await findPropertiesByAgentId(id);
    res.json(properties);
  } catch (err) {
    next(err);
  }
}

export async function rateAgent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const agentId = parseInt(req.params.id, 10);
    if (isNaN(agentId)) { res.status(400).json({ error: 'Invalid agent ID' }); return; }

    const { rating } = req.body as { rating?: number };
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'rating must be between 1 and 5' }); return;
    }

    const { pool } = await import('../db/connection');

    await pool.query(
      `INSERT INTO agent_ratings (agent_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (agent_id, user_id) DO UPDATE SET rating = EXCLUDED.rating`,
      [agentId, req.user!.userId, rating],
    );

    const { rows } = await pool.query<{ rating: string }>(
      `SELECT rating FROM agents WHERE id = $1`, [agentId]
    );
    res.json({ success: true, newAverage: parseFloat(rows[0]?.rating ?? '0') });
  } catch (err) {
    next(err);
  }
}

export async function getMyRating(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const agentId = parseInt(req.params.id, 10);
    if (isNaN(agentId)) { res.status(400).json({ error: 'Invalid agent ID' }); return; }

    const { pool } = await import('../db/connection');
    const { rows } = await pool.query<{ rating: number }>(
      `SELECT rating FROM agent_ratings WHERE agent_id = $1 AND user_id = $2`,
      [agentId, req.user!.userId],
    );
    res.json({ rating: rows[0]?.rating ?? null });
  } catch (err) {
    next(err);
  }
}

export async function getMyAgentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await agentModel.findAgentByUserId(req.user!.userId);
    res.json(profile ?? null);
  } catch (err) {
    next(err);
  }
}

const RERA_RE = /^RERA[A-Z0-9]{5,20}$/i;

export async function updateMyAgentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { agencyName, bio, licenseNumber, profileImage } =
      req.body as agentModel.UpdateAgentProfileInput;

    if (licenseNumber?.trim() && !RERA_RE.test(licenseNumber.trim())) {
      res.status(400).json({ error: 'License number must start with RERA followed by 5–20 alphanumeric characters (e.g. RERAMH12345)' });
      return;
    }

    const profile = await agentModel.upsertAgentProfile(req.user!.userId, {
      agencyName:    agencyName    ?? null,
      bio:           bio           ?? null,
      licenseNumber: licenseNumber ?? null,
      profileImage:  profileImage  ?? null,
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function contactAgent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    const { message, name, email, phone, propertyId } =
      req.body as { message?: string; name?: string; email?: string; phone?: string; propertyId?: number };
    if (!message?.trim()) {
      res.status(400).json({ error: 'message is required' });
      return;
    }
    await agentModel.saveContactInquiry({
      agentId: id,
      propertyId: propertyId ? Number(propertyId) : undefined,
      name,
      email,
      phone,
      message,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
