/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createPublicTripRegistrations,
  createTripRegistration,
  deleteTripRegistration,
  getTripPricePreview,
  listTripRegistrations,
  updateTripRegistration,
} from '../controllers/trip-registrations-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicReadLimiter, publicWriteLimiter } from '../middleware/rate-limit.js';
import { requireTurnstile } from '../middleware/turnstile-middleware.js';

const router = Router();

router.get('/tiles/:tileId/registrations', requireAuth, listTripRegistrations);
router.post('/tiles/:tileId/registrations', requireAuth, requirePermission('tiles:write'), createTripRegistration);
router.post(
  '/tiles/:tileId/registrations/public',
  publicWriteLimiter,
  requireTurnstile,
  createPublicTripRegistrations,
);
router.put('/registrations/:id', requireAuth, requirePermission('tiles:write'), updateTripRegistration);
router.delete('/registrations/:id', requireAuth, requirePermission('tiles:write'), deleteTripRegistration);

// Public, read-only computation (no DB write) - no Turnstile needed, unlike
// the registration POST above. publicReadLimiter, not publicWriteLimiter:
// this fires repeatedly as a debounced live price preview while a family
// fills in multiple participants' options, easily dozens of times per
// session - publicWriteLimiter's 20-per-15-min budget (sized for actual
// one-shot submissions) would 429 a legitimate user mid-form.
router.post('/tiles/:tileId/trip-price-preview', publicReadLimiter, getTripPricePreview);

export default router;
