import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  searchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  sendPropertyEnquiry,
  recordView,
} from '../controllers/propertyController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/featured', getFeaturedProperties);
router.get('/search', searchProperties);
router.get('/',      getProperties);
router.get('/:id',   getPropertyById);

router.post('/',           requireAuth, createProperty);
router.post('/:id/enquiry', sendPropertyEnquiry);
router.post('/:id/view',   recordView);
router.put('/:id',         requireAuth, updateProperty);
router.delete('/:id',      requireAuth, deleteProperty);

export default router;
