import { Router } from 'express';
import { getAllAgents, getAgentById, getAgentProperties, contactAgent } from '../controllers/agentController';

const router = Router();

// GET  /api/agents
router.get('/', getAllAgents);

// GET  /api/agents/:id
router.get('/:id', getAgentById);

// GET  /api/agents/:id/properties
router.get('/:id/properties', getAgentProperties);

// POST /api/agents/:id/contact
router.post('/:id/contact', contactAgent);

export default router;
