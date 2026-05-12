import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMyInquiries, getSentInquiries, markInquiryRead, getUnreadCount, replyToInquiry,
  getInquiryMessages, postInquiryMessage,
} from '../controllers/inquiryController';

const router = Router();

router.get('/',            requireAuth, getMyInquiries);
router.get('/sent',        requireAuth, getSentInquiries);
router.get('/unread',      requireAuth, getUnreadCount);
router.patch('/:id/read',  requireAuth, markInquiryRead);
router.post('/:id/reply',  requireAuth, replyToInquiry);
router.get('/:id/messages',  requireAuth, getInquiryMessages);
router.post('/:id/messages', requireAuth, postInquiryMessage);

export default router;
