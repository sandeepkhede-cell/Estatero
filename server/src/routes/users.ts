import { Router } from 'express';
import { getUser, updateUser, getUserProperties } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/:id',            getUser);
router.patch('/:id',          requireAuth, updateUser);
router.get('/:id/properties', getUserProperties);

export default router;
