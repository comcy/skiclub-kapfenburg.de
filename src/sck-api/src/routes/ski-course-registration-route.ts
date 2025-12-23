/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createSkiCourseRegistration,
    getSkiCourseRegistrations,
    getSkiCourseRegistrationById,
    updateSkiCourseRegistration,
    deleteSkiCourseRegistration,
} from '../controllers/ski-course-registration-controller.js';

const router = Router();

router.post('/ski-course-registrations', createSkiCourseRegistration);
router.get('/ski-course-registrations', getSkiCourseRegistrations);
router.get('/ski-course-registrations/:id', getSkiCourseRegistrationById);
router.put('/ski-course-registrations/:id', updateSkiCourseRegistration);
router.delete('/ski-course-registrations/:id', deleteSkiCourseRegistration);

export default router;
