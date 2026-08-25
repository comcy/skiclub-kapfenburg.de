/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { confirmMembershipRegistration, createMembershipRegistration } from '../controllers/membership-controller.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';
import { requireTurnstile } from '../middleware/turnstile-middleware.js';

const router = Router();

router.post('/membership/register', publicWriteLimiter, requireTurnstile, createMembershipRegistration);
// Kein Turnstile hier - der Mail-Klick selbst ist schon der Nachweis, dass
// kein Bot den Antrag gestellt hat.
router.post('/membership/confirm', publicWriteLimiter, confirmMembershipRegistration);

export default router;
