/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { getCurrentUser, googleCallback, googleStart, requestMagicLink, verifyMagicLink } from '../controllers/auth-controller.js';
import { requireAuth } from '../middleware/auth-middleware.js';

const router = Router();

router.post('/auth/magic-link', requestMagicLink);
router.post('/auth/magic-link/verify', verifyMagicLink);
router.get('/auth/google/start', googleStart);
router.get('/auth/google/callback', googleCallback);
router.get('/auth/me', requireAuth, getCurrentUser);

export default router;
