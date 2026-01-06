/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createCourseRegistration,
    getCourseRegistrations,
    getCourseRegistrationById,
    updateCourseRegistration,
    deleteCourseRegistration,
} from '../controllers/course-registration-controller.js';

const router = Router();

router.post('/course-registrations', createCourseRegistration);
router.get('/course-registrations', getCourseRegistrations);
router.get('/course-registrations/:id', getCourseRegistrationById);
router.put('/course-registrations/:id', updateCourseRegistration);
router.delete('/course-registrations/:id', deleteCourseRegistration);

export default router;
