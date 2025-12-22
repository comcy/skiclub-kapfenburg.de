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

router.post('/register', createRegistration);
router.get('/register', getAllRegistrations);
router.get('/register/:id', getRegistrationById);

export default router;
