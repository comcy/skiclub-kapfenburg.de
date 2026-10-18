/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { createRegistration } from '../controllers/registration-controller.js';
import { publicWriteLimiter } from '../middleware/rate-limit.js';
import { requireTurnstile } from '../middleware/turnstile-middleware.js';

const router = Router();

router.post('/register', publicWriteLimiter, requireTurnstile, createRegistration);

export default router;
