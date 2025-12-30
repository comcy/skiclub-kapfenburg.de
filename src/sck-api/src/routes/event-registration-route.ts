/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createEventRegistration,
    getEventRegistrations,
    getEventRegistrationById,
} from '../controllers/event-registration-controller.js';

const router = Router({ mergeParams: true });

router.post('/', createEventRegistration);
router.get('/', getEventRegistrations);
router.get('/:id', getEventRegistrationById);

export default router;
