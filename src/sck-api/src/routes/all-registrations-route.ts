/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    getAllRegistrations,
} from '../controllers/event-registration-controller.js';

const router = Router();

router.get('/', getAllRegistrations);

export default router;
