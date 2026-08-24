/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import {
  AgeCategory,
  PublicParticipantInput,
  PublicRegistrationResult,
  RegistrationStatus,
  TripRegistration,
  TripRegistrationCreationParams,
} from '../domain/trip-registration.js';
import { findMemberByEmail } from './members-service.js';

interface TripRegistrationRow {
  id: string;
  tile_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  member_id: string | null;
  boarding_id: string | null;
  boarding_name: string | null;
  age_category: string;
  is_member: number;
  status: string;
  source: string;
  notes: string | null;
  order_index: number;
}

const SELECT_WITH_BOARDING_NAME = `
  SELECT r.*, b.name AS boarding_name
  FROM trip_registrations r
  LEFT JOIN boardings b ON b.id = r.boarding_id
`;

const rowToRegistration = (row: TripRegistrationRow): TripRegistration => ({
  id: row.id,
  tileId: row.tile_id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email ?? undefined,
  phone: row.phone ?? undefined,
  memberId: row.member_id ?? undefined,
  boardingId: row.boarding_id ?? undefined,
  boardingName: row.boarding_name ?? undefined,
  ageCategory: row.age_category as TripRegistration['ageCategory'],
  isMember: row.is_member === 1,
  status: row.status as TripRegistration['status'],
  source: row.source as TripRegistration['source'],
  notes: row.notes ?? undefined,
  orderIndex: row.order_index,
});

export const listRegistrationsForTile = (tileId: string): TripRegistration[] => {
  const rows = db
    .prepare(`${SELECT_WITH_BOARDING_NAME} WHERE r.tile_id = ? ORDER BY b.name, r.order_index, r.created_at`)
    .all(tileId) as unknown as TripRegistrationRow[];
  return rows.map(rowToRegistration);
};

export const getRegistration = (id: string): TripRegistration | undefined => {
  const row = db.prepare(`${SELECT_WITH_BOARDING_NAME} WHERE r.id = ?`).get(id) as
    | TripRegistrationRow
    | undefined;
  return row ? rowToRegistration(row) : undefined;
};

// The member match is always derived from the email given at write time,
// never trusted from the client - see TripRegistrationCreationParams.
const resolveMember = (email: string | undefined): { id: string | null; isMember: number } => {
  const member = email ? findMemberByEmail(email) : undefined;
  return { id: member?.id ?? null, isMember: member ? 1 : 0 };
};

export const createRegistration = (tileId: string, params: TripRegistrationCreationParams): TripRegistration => {
  const id = randomUUID();
  const { id: memberId, isMember } = resolveMember(params.email);

  db.prepare(
    `INSERT INTO trip_registrations (
      id, tile_id, first_name, last_name, email, phone, member_id, boarding_id,
      age_category, is_member, status, source, notes, order_index
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    tileId,
    params.firstName,
    params.lastName,
    params.email ?? null,
    params.phone ?? null,
    memberId,
    params.boardingId ?? null,
    params.ageCategory,
    isMember,
    params.status,
    params.source,
    params.notes ?? null,
    params.orderIndex ?? 0,
  );

  return getRegistration(id) as TripRegistration;
};

export const updateRegistration = (
  id: string,
  params: TripRegistrationCreationParams,
): TripRegistration | undefined => {
  const { id: memberId, isMember } = resolveMember(params.email);

  const result = db
    .prepare(
      `UPDATE trip_registrations SET
        first_name = ?, last_name = ?, email = ?, phone = ?, member_id = ?, boarding_id = ?,
        age_category = ?, is_member = ?, status = ?, source = ?, notes = ?, order_index = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = ?`,
    )
    .run(
      params.firstName,
      params.lastName,
      params.email ?? null,
      params.phone ?? null,
      memberId,
      params.boardingId ?? null,
      params.ageCategory,
      isMember,
      params.status,
      params.source,
      params.notes ?? null,
      params.orderIndex ?? 0,
      id,
    );

  if (result.changes === 0) return undefined;
  return getRegistration(id);
};

export const deleteRegistration = (id: string): boolean => {
  const result = db.prepare('DELETE FROM trip_registrations WHERE id = ?').run(id);
  return result.changes > 0;
};

// Same age brackets as the public site's client-side price calculation
// (data/mail-templates/trip-confirmation-mail.function.ts calculateParticipantPrice)
// - duplicated rather than imported, sck-api never depends on the web workspace.
const calculateAge = (birthday: string, refDate: Date = new Date()): number => {
  const dob = new Date(birthday);
  if (isNaN(dob.getTime())) return NaN;
  let age = refDate.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    refDate.getMonth() > dob.getMonth() ||
    (refDate.getMonth() === dob.getMonth() && refDate.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
};

const resolveAgeCategory = (birthday: string | undefined): AgeCategory => {
  if (!birthday) return 'adult';
  const age = calculateAge(birthday);
  if (isNaN(age) || age < 0) return 'adult';
  if (age <= 6) return 'childUntil6';
  if (age <= 16) return 'youthUntil16';
  return 'adult';
};

const resolveBoardingId = (boardingName: string | undefined): string | undefined => {
  if (!boardingName) return undefined;
  const row = db.prepare('SELECT id FROM boardings WHERE name = ? COLLATE NOCASE').get(boardingName) as
    | { id: string }
    | undefined;
  return row?.id;
};

// Public entry point for the website's Ausfahrten registration form (kept
// deliberately parallel to, not replacing, its existing Google-Sheet
// submission - see the plan). A whole submission (contact person + any
// additional participants, e.g. a family) is treated as one unit: it only
// gets 'confirmed' if the FULL group still fits in the remaining capacity,
// otherwise every participant in it goes to 'waitlist' together - never
// split across statuses.
export const createPublicRegistrations = (
  tileId: string,
  participants: PublicParticipantInput[],
): PublicRegistrationResult => {
  const tileRow = db.prepare('SELECT capacity FROM tiles WHERE id = ?').get(tileId) as
    | { capacity: number | null }
    | undefined;
  const capacity = tileRow?.capacity ?? null;

  const confirmedCount = (
    db
      .prepare(`SELECT COUNT(*) AS count FROM trip_registrations WHERE tile_id = ? AND status = 'confirmed'`)
      .get(tileId) as { count: number }
  ).count;

  const fitsInRemainingCapacity = capacity === null || confirmedCount + participants.length <= capacity;
  const status: RegistrationStatus = fitsInRemainingCapacity ? 'confirmed' : 'waitlist';

  let waitlistPosition: number | undefined;
  let waitlistCount: number | undefined;
  if (status === 'waitlist') {
    const existingWaitlistCount = (
      db
        .prepare(`SELECT COUNT(*) AS count FROM trip_registrations WHERE tile_id = ? AND status = 'waitlist'`)
        .get(tileId) as { count: number }
    ).count;
    waitlistPosition = existingWaitlistCount + 1;
    waitlistCount = participants.length;
  }

  participants.forEach((participant, index) => {
    createRegistration(tileId, {
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      boardingId: resolveBoardingId(participant.boarding),
      ageCategory: resolveAgeCategory(participant.birthday),
      status,
      source: 'sheet-import',
      orderIndex: index,
    });
  });

  return { status, waitlistPosition, waitlistCount };
};
