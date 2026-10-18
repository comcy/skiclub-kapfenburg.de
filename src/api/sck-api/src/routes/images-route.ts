/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { handleImageDelete, handleImageUpload, listUploadedImages } from '../controllers/images-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.post('/images/upload', requireAuth, requirePermission('tiles:write'), handleImageUpload);
router.get('/images', requireAuth, listUploadedImages);
router.delete('/images/:filename', requireAuth, requirePermission('tiles:write'), handleImageDelete);

export default router;
