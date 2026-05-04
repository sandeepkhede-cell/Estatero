import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  searchProperties,
} from '../controllers/propertyController';

const router = Router();

// GET /api/properties/featured   — must be declared before /:id
router.get('/featured', getFeaturedProperties);

// GET /api/properties/search?q=...
router.get('/search', searchProperties);

// GET /api/properties?page=1&city=Mumbai&propertyType=apartment&bhk=2&priceRange=5000000&sortBy=newest
router.get('/', getProperties);

// GET /api/properties/:id
router.get('/:id', getPropertyById);

export default router;
