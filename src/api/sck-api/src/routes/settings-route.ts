/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  getNotificationBccSetting,
  getSkiCoursePricingSetting,
  getTripPricingSetting,
  updateNotificationBccSetting,
  updateSkiCoursePricingSetting,
  updateTripPricingSetting,
} from '../controllers/settings-controller.js';
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

// Public - the public site computes ski-course registration prices from this.
router.get('/settings/ski-course-pricing', publicReadLimiter, getSkiCoursePricingSetting);
router.put(
  '/settings/ski-course-pricing',
  requireAuth,
  requirePermission('tiles:write'),
  updateSkiCoursePricingSetting,
);

// Public - the public site merges this into every "Ausfahrt mit Kursmöglichkeit" tile.
router.get('/settings/trip-pricing', publicReadLimiter, getTripPricingSetting);
router.put('/settings/trip-pricing', requireAuth, requirePermission('tiles:write'), updateTripPricingSetting);

export default router;
