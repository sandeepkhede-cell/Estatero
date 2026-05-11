import { Router } from 'express';
import { getAllAgents, getAgentById, getAgentProperties, contactAgent, getMyAgentProfile, updateMyAgentProfile } from '../controllers/agentController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET  /api/agents
router.get('/', getAllAgents);

// GET  /api/agents/me   — must be before /:id
router.get('/me',   requireAuth, getMyAgentProfile);
// PATCH /api/agents/me
router.patch('/me', requireAuth, updateMyAgentProfile);

// GET  /api/agents/:id
router.get('/:id', getAgentById);

// GET  /api/agents/:id/properties
router.get('/:id/properties', getAgentProperties);

// POST /api/agents/:id/contact
router.post('/:id/contact', contactAgent);

export default router;
