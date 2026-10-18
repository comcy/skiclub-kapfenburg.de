/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { sendEmail } from '../controllers/email-controller';
import { publicWriteLimiter } from '../middleware/rate-limit.js';

const router = Router();

router.post('/send_email', publicWriteLimiter, sendEmail);

export default router;
