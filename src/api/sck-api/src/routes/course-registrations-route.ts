/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createCourseGroup,
  createCourseRegistration,
  deleteCourseGroup,
  deleteCourseRegistration,
  listCourseGroups,
  listCourseRegistrations,
  updateCourseGroup,
  updateCourseRegistration,
} from '../controllers/course-registrations-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/tiles/:tileId/course-registrations', requireAuth, listCourseRegistrations);
router.post(
  '/tiles/:tileId/course-registrations',
  requireAuth,
  requirePermission('tiles:write'),
  createCourseRegistration,
);
router.put('/course-registrations/:id', requireAuth, requirePermission('tiles:write'), updateCourseRegistration);
router.delete('/course-registrations/:id', requireAuth, requirePermission('tiles:write'), deleteCourseRegistration);

router.get('/tiles/:tileId/course-groups', requireAuth, listCourseGroups);
router.post('/tiles/:tileId/course-groups', requireAuth, requirePermission('tiles:write'), createCourseGroup);
router.put('/course-groups/:id', requireAuth, requirePermission('tiles:write'), updateCourseGroup);
router.delete('/course-groups/:id', requireAuth, requirePermission('tiles:write'), deleteCourseGroup);

export default router;
