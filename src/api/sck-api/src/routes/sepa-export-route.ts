/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  generateSepaExport,
  listSepaExportCandidates,
  previewSepaExport,
} from '../controllers/sepa-export-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/sepa-export/candidates', requireAuth, requirePermission('sepa:export'), listSepaExportCandidates);
router.post('/sepa-export/preview', requireAuth, requirePermission('sepa:export'), previewSepaExport);
router.post('/sepa-export/generate', requireAuth, requirePermission('sepa:export'), generateSepaExport);

export default router;
