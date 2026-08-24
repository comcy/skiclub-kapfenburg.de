/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createPublicTripRegistrations,
  createTripRegistration,
  deleteTripRegistration,
  listTripRegistrations,
  updateTripRegistration,
} from '../controllers/trip-registrations-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';

const router = Router();

router.get('/tiles/:tileId/registrations', requireAuth, listTripRegistrations);
router.post('/tiles/:tileId/registrations', requireAuth, requirePermission('tiles:write'), createTripRegistration);
router.post('/tiles/:tileId/registrations/public', publicWriteLimiter, createPublicTripRegistrations);
router.put('/registrations/:id', requireAuth, requirePermission('tiles:write'), updateTripRegistration);
router.delete('/registrations/:id', requireAuth, requirePermission('tiles:write'), deleteTripRegistration);

export default router;
