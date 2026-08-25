/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { createMembershipRegistration } from '../controllers/membership-controller.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';
import { requireTurnstile } from '../middleware/turnstile-middleware.js';

const router = Router();

router.post('/membership/register', publicWriteLimiter, requireTurnstile, createMembershipRegistration);

export default router;
