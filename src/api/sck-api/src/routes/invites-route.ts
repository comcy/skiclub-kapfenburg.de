/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { acceptInvite, createInvite, listInvites } from '../controllers/invites-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

// Accepting an invite is how a brand-new user authenticates for the first
// time — must stay open, no requireAuth.
router.post('/invites/accept', acceptInvite);

router.get('/invites', requireAuth, requirePermission('users:manage'), listInvites);
router.post('/invites', requireAuth, requirePermission('users:manage'), createInvite);

export default router;
