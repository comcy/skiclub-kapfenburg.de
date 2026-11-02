/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { postPresence } from '../controllers/presence-controller.js';
import { requireAuth } from '../middleware/auth-middleware.js';

const router = Router();

router.post('/presence', requireAuth, postPresence);

export default router;
