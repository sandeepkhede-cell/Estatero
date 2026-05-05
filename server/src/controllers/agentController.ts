import { Request, Response, NextFunction } from 'express';
import * as agentModel from '../models/agentModel';
import { findPropertiesByAgentId } from '../models/propertyModel';

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
