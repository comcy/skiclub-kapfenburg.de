/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { getNotificationBccSetting, updateNotificationBccSetting } from '../controllers/settings-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicReadLimiter } from '../middleware/rate-limit.js';

const router = Router();

// Public - the public site needs to read the global BCC fallback.
router.get('/settings/notification-bcc', publicReadLimiter, getNotificationBccSetting);
router.put(
  '/settings/notification-bcc',
  requireAuth,
  requirePermission('tiles:write'),
  updateNotificationBccSetting,
);

export default router;
