/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createVerifiedPersonHandler,
  listVerifiedPersonsHandler,
  revokeVerifiedPersonHandler,
} from '../controllers/verified-persons-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

// Wer Anmeldungen bearbeiten darf (tiles:write), darf auch Personen als Mitglied verifizieren.
router.get('/verified-persons', requireAuth, requirePermission('tiles:write'), listVerifiedPersonsHandler);
router.post('/verified-persons', requireAuth, requirePermission('tiles:write'), createVerifiedPersonHandler);
router.post('/verified-persons/:id/revoke', requireAuth, requirePermission('tiles:write'), revokeVerifiedPersonHandler);

export default router;
