/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { acceptInvite, createInvite, getInvitePreview, listInvites } from '../controllers/invites-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicReadLimiter, publicWriteLimiter } from '../middleware/rate-limit.js';

const router = Router();

// Previewing and accepting an invite are how a brand-new user authenticates
// for the first time — must stay open, no requireAuth.
router.post('/invites/accept', publicWriteLimiter, acceptInvite);
router.get('/invites/:token', publicReadLimiter, getInvitePreview);

router.get('/invites', requireAuth, requirePermission('users:manage'), listInvites);
router.post('/invites', requireAuth, requirePermission('users:manage'), createInvite);

export default router;
