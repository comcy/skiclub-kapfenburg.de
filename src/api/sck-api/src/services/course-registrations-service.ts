/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import {
  CourseGroup,
  CourseGroupCreationParams,
  CourseRegistration,
  CourseRegistrationCreationParams,
} from '../domain/course-registration.js';
import { findMemberByEmail } from './members-service.js';

interface CourseRegistrationRow {
  id: string;
  tile_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  member_id: string | null;
  birthday: string | null;
  sport_type: string | null;
  level: string | null;
  group_id: string | null;
  is_member: number;
  status: string;
  source: string;
  notes: string | null;
  order_index: number;
  entered_by: string | null;
  paid: number;
  transferred_to_external_list: number;
  confirmation_mail_sent: number;
}

const rowToRegistration = (row: CourseRegistrationRow): CourseRegistration => ({
  id: row.id,
  tileId: row.tile_id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email ?? undefined,
  phone: row.phone ?? undefined,
  memberId: row.member_id ?? undefined,
  birthday: row.birthday ?? undefined,
  sportType: row.sport_type ?? undefined,
  level: row.level ?? undefined,
  groupId: row.group_id ?? undefined,
  isMember: row.is_member === 1,
  status: row.status as CourseRegistration['status'],
  source: row.source as CourseRegistration['source'],
  notes: row.notes ?? undefined,
  orderIndex: row.order_index,
  enteredBy: row.entered_by ?? undefined,
  paid: row.paid === 1,
  transferredToExternalList: row.transferred_to_external_list === 1,
  confirmationMailSent: row.confirmation_mail_sent === 1,
});

export const listRegistrationsForTile = (tileId: string): CourseRegistration[] => {
  const rows = db
    .prepare('SELECT * FROM course_registrations WHERE tile_id = ? ORDER BY order_index, created_at')
    .all(tileId) as unknown as CourseRegistrationRow[];
  return rows.map(rowToRegistration);
};

export const getRegistration = (id: string): CourseRegistration | undefined => {
  const row = db.prepare('SELECT * FROM course_registrations WHERE id = ?').get(id) as
    | CourseRegistrationRow
    | undefined;
  return row ? rowToRegistration(row) : undefined;
};

// The member match is always derived from the email given at write time,
// never trusted from the client - see CourseRegistrationCreationParams.
const resolveMember = (email: string | undefined): { id: string | null; isMember: number } => {
  const member = email ? findMemberByEmail(email) : undefined;
  return { id: member?.id ?? null, isMember: member ? 1 : 0 };
};

export const createRegistration = (
  tileId: string,
  params: CourseRegistrationCreationParams,
  enteredBy?: string,
): CourseRegistration => {
  const id = randomUUID();
  const { id: memberId, isMember } = resolveMember(params.email);

  db.prepare(
    `INSERT INTO course_registrations (
      id, tile_id, first_name, last_name, email, phone, member_id, birthday,
      sport_type, level, group_id, is_member, status, source, notes, order_index,
      entered_by, paid, transferred_to_external_list, confirmation_mail_sent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    tileId,
    params.firstName,
    params.lastName,
    params.email ?? null,
    params.phone ?? null,
    memberId,
    params.birthday ?? null,
    params.sportType ?? null,
    params.level ?? null,
    params.groupId ?? null,
    isMember,
    params.status,
    params.source,
    params.notes ?? null,
    params.orderIndex ?? 0,
    enteredBy ?? null,
    params.paid ? 1 : 0,
    params.transferredToExternalList ? 1 : 0,
    // confirmation_mail_sent starts false always - only markConfirmationMailSent
    // flips it, after a successful send (see the controller).
    0,
  );

  return getRegistration(id) as CourseRegistration;
};

// entered_by is deliberately absent from this UPDATE - it's set once at
// creation and never overwritten, same reasoning as members-service.ts
// excluding honored_years from its own update statement.
export const updateRegistration = (
  id: string,
  params: CourseRegistrationCreationParams,
): CourseRegistration | undefined => {
  const { id: memberId, isMember } = resolveMember(params.email);

  const result = db
    .prepare(
      `UPDATE course_registrations SET
        first_name = ?, last_name = ?, email = ?, phone = ?, member_id = ?, birthday = ?,
        sport_type = ?, level = ?, group_id = ?, is_member = ?, status = ?, source = ?,
        notes = ?, order_index = ?, paid = ?, transferred_to_external_list = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = ?`,
    )
    .run(
      params.firstName,
      params.lastName,
      params.email ?? null,
      params.phone ?? null,
      memberId,
      params.birthday ?? null,
      params.sportType ?? null,
      params.level ?? null,
      params.groupId ?? null,
      isMember,
      params.status,
      params.source,
      params.notes ?? null,
      params.orderIndex ?? 0,
      params.paid ? 1 : 0,
      params.transferredToExternalList ? 1 : 0,
      id,
    );

  if (result.changes === 0) return undefined;
  return getRegistration(id);
};

// Nur nach erfolgreichem sendMail() aufgerufen (siehe Controller) - kein
// Weg für den Client, dieses Flag selbst zu setzen (siehe
// CourseRegistrationCreationParams' Ausschluss und updateRegistration oben).
export const markConfirmationMailSent = (id: string): void => {
  db.prepare('UPDATE course_registrations SET confirmation_mail_sent = 1 WHERE id = ?').run(id);
};

export const deleteRegistration = (id: string): boolean => {
  const result = db.prepare('DELETE FROM course_registrations WHERE id = ?').run(id);
  return result.changes > 0;
};

export interface PublicCourseRegistrationInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  sportType?: string;
  level?: string;
  notes?: string;
}

// Courses have no capacity/waitlist concept (unlike trip-registrations-
// service.ts's createPublicRegistrations), so this is a plain insert -
// always 'confirmed'. 'sheet-import' is reused (not a new enum value) as
// the source for "came in through the public website form", same
// convention already established for trips.
export const createPublicRegistration = (tileId: string, params: PublicCourseRegistrationInput): CourseRegistration =>
  createRegistration(tileId, {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phone: params.phone,
    sportType: params.sportType,
    level: params.level,
    status: 'confirmed',
    source: 'sheet-import',
    notes: params.notes,
    orderIndex: 0,
    paid: false,
    transferredToExternalList: false,
  });

interface CourseGroupRow {
  id: string;
  tile_id: string;
  name: string;
  instructor_name: string | null;
  created_at: string;
}

const rowToGroup = (row: CourseGroupRow): CourseGroup => ({
  id: row.id,
  tileId: row.tile_id,
  name: row.name,
  instructorName: row.instructor_name ?? undefined,
  createdAt: row.created_at,
});

export const listGroupsForTile = (tileId: string): CourseGroup[] => {
  const rows = db
    .prepare('SELECT * FROM course_groups WHERE tile_id = ? ORDER BY name')
    .all(tileId) as unknown as CourseGroupRow[];
  return rows.map(rowToGroup);
};

export const getGroup = (id: string): CourseGroup | undefined => {
  const row = db.prepare('SELECT * FROM course_groups WHERE id = ?').get(id) as CourseGroupRow | undefined;
  return row ? rowToGroup(row) : undefined;
};

export const createGroup = (tileId: string, params: CourseGroupCreationParams): CourseGroup => {
  const id = randomUUID();
  db.prepare('INSERT INTO course_groups (id, tile_id, name, instructor_name) VALUES (?, ?, ?, ?)').run(
    id,
    tileId,
    params.name,
    params.instructorName ?? null,
  );
  return getGroup(id) as CourseGroup;
};

export const updateGroup = (id: string, params: CourseGroupCreationParams): CourseGroup | undefined => {
  const result = db
    .prepare('UPDATE course_groups SET name = ?, instructor_name = ? WHERE id = ?')
    .run(params.name, params.instructorName ?? null, id);
  if (result.changes === 0) return undefined;
  return getGroup(id);
};

export const deleteGroup = (id: string): boolean => {
  const result = db.prepare('DELETE FROM course_groups WHERE id = ?').run(id);
  return result.changes > 0;
};
