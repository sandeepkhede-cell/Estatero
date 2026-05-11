import { Router } from 'express';
import { getAllAgents, getAgentById, getAgentProperties, contactAgent, getMyAgentProfile, updateMyAgentProfile, rateAgent, getMyRating } from '../controllers/agentController';
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

// POST /api/agents/:id/rate       — submit / update a 1-5 star rating (auth required)
router.post('/:id/rate',     requireAuth, rateAgent);

// GET  /api/agents/:id/my-rating  — fetch current user's own rating for this agent
router.get('/:id/my-rating', requireAuth, getMyRating);

export default router;
