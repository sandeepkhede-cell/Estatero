import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getMyInquiries, markInquiryRead, getUnreadCount, replyToInquiry } from '../controllers/inquiryController';

const router = Router();

// GET  /api/inquiries          — all enquiries for the logged-in user's listings
router.get('/',           requireAuth, getMyInquiries);

// GET  /api/inquiries/unread   — unread count badge
router.get('/unread',     requireAuth, getUnreadCount);

// PATCH /api/inquiries/:id/read  — mark one as read
router.patch('/:id/read',  requireAuth, markInquiryRead);

// POST  /api/inquiries/:id/reply — send a reply (saves to DB + emails sender)
router.post('/:id/reply',  requireAuth, replyToInquiry);

export default router;
