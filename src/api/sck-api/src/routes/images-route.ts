/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { handleImageUpload } from '../controllers/images-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.post('/images/upload', requireAuth, requirePermission('tiles:write'), handleImageUpload);

export default router;
