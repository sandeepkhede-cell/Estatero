import { Router } from 'express';
import { getMyFavourites, addToFavourites, removeFromFavourites } from '../controllers/favouriteController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/',               requireAuth, getMyFavourites);
router.post('/:propertyId',   requireAuth, addToFavourites);
router.delete('/:propertyId', requireAuth, removeFromFavourites);

export default router;
