import { Router } from 'express';
import { getSuggestions, getPopular, trackSearch } from '../controllers/searchController';

const router = Router();

// GET /api/search/suggestions?q=Mumbai
router.get('/suggestions', getSuggestions);

// GET /api/search/popular
router.get('/popular', getPopular);

// POST /api/search/track  { query: "2bhk flats in Mumbai" }
router.post('/track', trackSearch);

export default router;
