/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  archiveTile,
  createTile,
  deleteTile,
  getTile,
  listArchivedTiles,
  listTiles,
  unarchiveTile,
  updateTile,
  updateTileBoardings,
} from '../controllers/tiles-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';
import { publicReadLimiter } from '../middleware/rate-limit.js';

const router = Router();

// Reads are public — the public site (sck-app) fetches tiles at runtime
// without any admin login.
router.get('/tiles', publicReadLimiter, listTiles);
// Vor /tiles/:id, sonst wird "archive" als id gelesen. Nur fuer angemeldete Admins.
router.get('/tiles/archive', requireAuth, listArchivedTiles);
router.get('/tiles/:id', publicReadLimiter, getTile);

router.post('/tiles', requireAuth, requirePermission('tiles:write'), createTile);
router.put('/tiles/:id', requireAuth, requirePermission('tiles:write'), updateTile);
router.delete('/tiles/:id', requireAuth, requirePermission('tiles:write'), deleteTile);
router.post('/tiles/:id/archive', requireAuth, requirePermission('tiles:write'), archiveTile);
router.post('/tiles/:id/unarchive', requireAuth, requirePermission('tiles:write'), unarchiveTile);
router.put('/tiles/:id/boardings', requireAuth, requirePermission('tiles:write'), updateTileBoardings);

export default router;
