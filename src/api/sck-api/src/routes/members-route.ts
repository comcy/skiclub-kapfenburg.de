/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Router } from 'express';
import {
  createMember,
  deleteMember,
  getMember,
  listMembers,
  listMembershipApplications,
  updateMember,
} from '../controllers/members-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

// Unlike tiles/boardings, member records are personal data (name, address,
// birthday) - even reads require members:manage, not just any authenticated
// admin user.
router.get('/members', requireAuth, requirePermission('members:manage'), listMembers);
router.get('/members/applications', requireAuth, requirePermission('members:manage'), listMembershipApplications);
router.get('/members/:id', requireAuth, requirePermission('members:manage'), getMember);
router.post('/members', requireAuth, requirePermission('members:manage'), createMember);
router.put('/members/:id', requireAuth, requirePermission('members:manage'), updateMember);
router.delete('/members/:id', requireAuth, requirePermission('members:manage'), deleteMember);

export default router;
