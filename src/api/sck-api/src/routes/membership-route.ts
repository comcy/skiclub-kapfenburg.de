/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import { createMembershipRegistration } from '../controllers/membership-controller.js';

const router = Router();

router.post('/membership/register', createMembershipRegistration);

export default router;
