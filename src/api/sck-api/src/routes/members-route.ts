/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import express, { Router } from 'express';
import {
  createMember,
  deleteMember,
  getAnniversaries,
  getMember,
  listMembers,
  getApplicationIban,
  listMembershipApplications,
  listTeachingTeam,
  markHonored,
  updateMember,
} from '../controllers/members-controller.js';
import { applyMembersImport, previewMembersImport, previewMembersImportRecords } from '../controllers/members-import-controller.js';
import { requireAuth, requirePermission } from '../middleware/auth-middleware.js';

const router = Router();

// Unlike tiles/boardings, member records are personal data (name, address,
// birthday) - even reads require members:manage, not just any authenticated
// admin user.
router.get('/members', requireAuth, requirePermission('members:manage'), listMembers);
router.get('/members/applications', requireAuth, requirePermission('members:manage'), listMembershipApplications);
router.get(
  '/members/applications/:registrationId/iban',
  requireAuth,
  requirePermission('members:manage'),
  getApplicationIban,
);
router.get('/members/teaching-team', requireAuth, requirePermission('tiles:write'), listTeachingTeam);
router.get('/members/anniversaries', requireAuth, requirePermission('members:manage'), getAnniversaries);
router.get('/members/:id', requireAuth, requirePermission('members:manage'), getMember);
router.post('/members', requireAuth, requirePermission('members:manage'), createMember);
router.put('/members/:id', requireAuth, requirePermission('members:manage'), updateMember);
router.delete('/members/:id', requireAuth, requirePermission('members:manage'), deleteMember);
router.post('/members/:id/honor', requireAuth, requirePermission('members:manage'), markHonored);

// Order matters: these must come before /members/:id so 'import' isn't
// swallowed as an :id.
router.post('/members/import/preview', requireAuth, requirePermission('members:manage'), previewMembersImport);
// Größere Listen als das globale 100kb-JSON-Limit (eine Seite Mitgliederliste = mehrere hundert Datensätze).
router.post(
  '/members/import/preview-records',
  requireAuth,
  requirePermission('members:manage'),
  express.json({ limit: '5mb' }),
  previewMembersImportRecords,
);
router.post('/members/import/apply', requireAuth, requirePermission('members:manage'), applyMembersImport);

export default router;
