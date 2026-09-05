/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import {
  AgeCategory,
  PublicParticipantInput,
  PublicRegistrationCreateResult,
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
  transferred_to_external_list: number;
  confirmation_mail_sent: number;
  bus_only: number;
  snowshoes: number;
  course_requested: number;
  level: string | null;
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
  transferredToExternalList: row.transferred_to_external_list === 1,
  confirmationMailSent: row.confirmation_mail_sent === 1,
  busOnly: row.bus_only === 1,
  snowshoes: row.snowshoes === 1,
  courseRequested: row.course_requested === 1,
  level: row.level ?? undefined,
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
      age_category, is_member, status, source, notes, order_index,
      transferred_to_external_list, confirmation_mail_sent, bus_only, snowshoes,
      course_requested, level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    params.transferredToExternalList ? 1 : 0,
    // confirmation_mail_sent starts false always - only markConfirmationMailSent
    // flips it, after a successful send (see the controller).
    0,
    params.busOnly ? 1 : 0,
    params.snowshoes ? 1 : 0,
    params.courseRequested ? 1 : 0,
    params.level ?? null,
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
        transferred_to_external_list = ?, bus_only = ?, snowshoes = ?, course_requested = ?, level = ?,
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
      params.transferredToExternalList ? 1 : 0,
      params.busOnly ? 1 : 0,
      params.snowshoes ? 1 : 0,
      params.courseRequested ? 1 : 0,
      params.level ?? null,
      id,
    );

  if (result.changes === 0) return undefined;
  return getRegistration(id);
};

// Nur nach erfolgreichem sendMail() aufgerufen (siehe Controller) - kein
// Weg für den Client, dieses Flag selbst zu setzen (siehe
// TripRegistrationCreationParams' Ausschluss und updateRegistration oben).
// Batch-Variante, weil eine ganze Gruppen-Anmeldung (mehrere Teilnehmer) über
// eine einzige Mail bestätigt wird - siehe createPublicRegistrations.
export const markConfirmationMailSent = (ids: string[]): void => {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(', ');
  db.prepare(`UPDATE trip_registrations SET confirmation_mail_sent = 1 WHERE id IN (${placeholders})`).run(...ids);
};

export const deleteRegistration = (id: string): boolean => {
  const result = db.prepare('DELETE FROM trip_registrations WHERE id = ?').run(id);
  return result.changes > 0;
};

// Same age brackets as the public site's client-side price calculation
// (data/mail-templates/trip-confirmation-mail.function.ts calculateParticipantPrice)
// - duplicated rather than imported, sck-api never depends on the web workspace.
export const calculateAge = (birthday: string, refDate: Date = new Date()): number => {
  const dob = new Date(birthday);
  if (isNaN(dob.getTime())) return NaN;
  let age = refDate.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    refDate.getMonth() > dob.getMonth() ||
    (refDate.getMonth() === dob.getMonth() && refDate.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
};

// Exported for reuse by trip-pricing-service.ts, rather than a third
// duplicate of the same age-bracket logic (see the plan).
export const resolveAgeCategory = (birthday: string | undefined): AgeCategory => {
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
): PublicRegistrationCreateResult => {
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

  const registrationIds = participants.map((participant, index) =>
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
      transferredToExternalList: false,
      busOnly: participant.busOnly ?? false,
      snowshoes: participant.snowshoes ?? false,
      courseRequested: participant.courseRequested ?? false,
      level: participant.level,
    }).id,
  );

  return { status, waitlistPosition, waitlistCount, registrationIds };
};
