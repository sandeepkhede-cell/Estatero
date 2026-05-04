import { Router } from 'express';
import { getAgentById, contactAgent } from '../controllers/agentController';

const router = Router();

// GET  /api/agents/:id
router.get('/:id', getAgentById);

// POST /api/agents/:id/contact  { message: string, email?: string }
router.post('/:id/contact', contactAgent);

export default router;
