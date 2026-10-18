/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import { listUserDirectory, listUsers, updateUserPermissions } from '../controllers/users-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/users', requireAuth, requirePermission('users:manage'), listUsers);
router.get('/users/directory', requireAuth, listUserDirectory);
router.put('/users/:id/permissions', requireAuth, requirePermission('users:manage'), updateUserPermissions);

export default router;
