/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  exchangeGoogleLoginCode,
  getCurrentUser,
  googleCallback,
  googleStart,
  requestMagicLink,
  verifyMagicLink,
} from '../controllers/auth-controller.js';
import { requireAuth } from '../middleware/auth-middleware.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';

const router = Router();

router.post('/auth/magic-link', publicWriteLimiter, requestMagicLink);
router.post('/auth/magic-link/verify', publicWriteLimiter, verifyMagicLink);
router.get('/auth/google/start', googleStart);
router.get('/auth/google/callback', googleCallback);
router.post('/auth/google/exchange', publicWriteLimiter, exchangeGoogleLoginCode);
router.get('/auth/me', requireAuth, getCurrentUser);

export default router;
