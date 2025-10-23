/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { createRegistration } from '../controllers/registration-controller.js';

const router = Router();

router.post('/register', createRegistration);

export default router;
