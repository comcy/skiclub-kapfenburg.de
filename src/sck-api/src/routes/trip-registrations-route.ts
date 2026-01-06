/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    getTripRegistrations,
} from '../controllers/event-registration-controller.js';

const router = Router();

router.get('/', getTripRegistrations);

export default router;
