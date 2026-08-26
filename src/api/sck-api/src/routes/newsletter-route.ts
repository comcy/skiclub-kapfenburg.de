/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createNewsletterSignup,
  deleteNewsletterSignup,
  listNewsletterSignups,
} from '../controllers/newsletter-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';
import { requireTurnstile } from '../middleware/turnstile-middleware.js';

const router = Router();

router.post('/newsletter/signup', publicWriteLimiter, requireTurnstile, createNewsletterSignup);
router.get('/newsletter/signups', requireAuth, requirePermission('members:manage'), listNewsletterSignups);
router.delete('/newsletter/signups/:id', requireAuth, requirePermission('members:manage'), deleteNewsletterSignup);

export default router;
