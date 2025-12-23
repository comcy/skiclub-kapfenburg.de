/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
} from '../controllers/registration-controller.js';

const router = Router();

router.post('/registrations', createRegistration);
router.get('/registrations', getAllRegistrations);
router.get('/registrations/:id', getRegistrationById);

export default router;
