/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { createBoarding, deleteBoarding, getBoarding, listBoardings, updateBoarding } from '../controllers/boardings-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/boardings', listBoardings);
router.get('/boardings/:id', getBoarding);

router.post('/boardings', requireAuth, requirePermission('boardings:write'), createBoarding);
router.put('/boardings/:id', requireAuth, requirePermission('boardings:write'), updateBoarding);
router.delete('/boardings/:id', requireAuth, requirePermission('boardings:write'), deleteBoarding);

export default router;
