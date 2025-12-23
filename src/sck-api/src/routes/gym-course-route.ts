/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createGymCourse,
    getGymCourses,
    getGymCourseById,
    updateGymCourse,
    deleteGymCourse,
} from '../controllers/gym-course-controller.js';

const router = Router();

router.post('/gym-courses', createGymCourse);
router.get('/gym-courses', getGymCourses);
router.get('/gym-courses/:id', getGymCourseById);
router.put('/gym-courses/:id', updateGymCourse);
router.delete('/gym-courses/:id', deleteGymCourse);

export default router;
