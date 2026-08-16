/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { createTile, deleteTile, getTile, listTiles, updateTile, updateTileBoardings } from '../controllers/tiles-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

// Reads are public — the public site (sck-app) fetches tiles at runtime
// without any admin login.
router.get('/tiles', listTiles);
router.get('/tiles/:id', getTile);

router.post('/tiles', requireAuth, requirePermission('tiles:write'), createTile);
router.put('/tiles/:id', requireAuth, requirePermission('tiles:write'), updateTile);
router.delete('/tiles/:id', requireAuth, requirePermission('tiles:write'), deleteTile);
router.put('/tiles/:id/boardings', requireAuth, requirePermission('tiles:write'), updateTileBoardings);

export default router;
