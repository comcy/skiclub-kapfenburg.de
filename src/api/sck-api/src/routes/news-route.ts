/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { getNews, postNewsSeen } from '../controllers/news-controller.js';
import { requireAuth } from '../middleware/auth-middleware.js';

const router = Router();

// Jeder angemeldete Admin: nur Zaehler, keine Datensaetze (Anträge nur mit members:manage).
router.get('/news', requireAuth, getNews);
router.post('/news/seen', requireAuth, postNewsSeen);

export default router;
