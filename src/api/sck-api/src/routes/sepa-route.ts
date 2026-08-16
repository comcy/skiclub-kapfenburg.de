/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { listSepaData } from '../controllers/sepa-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/sepa-data', requireAuth, requirePermission('sepa:read'), listSepaData);

export default router;
