/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { AnniversaryGroup, Member, MemberCreationParams, MembershipApplication } from '../domain/member.js';
import { PaginatedResponse } from '../domain/tile.js';
import { decryptField, encryptField } from './crypto-service.js';
import { listDataByType } from './data-service.js';
import { listConfirmedRegistrationIds } from './membership-confirmation-service.js';

interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  birthday: string | null;
  address: string | null;
  is_family_membership: number;
  family_group_id: string | null;
  status: string;
  source: string;
  application_registration_id: string | null;
  notes: string | null;
  member_since: string | null;
  external_id: string | null;
  iban_encrypted: string | null;
  bic: string | null;
  bank_name: string | null;
  account_holder: string | null;
  payment_method: string | null;
  honored_years: string;
}

const parseHonoredYears = (json: string): number[] => {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
};

const rowToMember = (row: MemberRow): Member => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email ?? undefined,
  phone: row.phone ?? undefined,
  mobile: row.mobile ?? undefined,
  birthday: row.birthday ?? undefined,
  address: row.address ?? undefined,
  isFamilyMembership: row.is_family_membership === 1,
  familyGroupId: row.family_group_id ?? undefined,
  status: row.status as Member['status'],
  source: row.source as Member['source'],
  applicationRegistrationId: row.application_registration_id ?? undefined,
  notes: row.notes ?? undefined,
  memberSince: row.member_since ?? undefined,
  externalId: row.external_id ?? undefined,
  iban: row.iban_encrypted ? decryptField(row.iban_encrypted) : undefined,
  bic: row.bic ?? undefined,
  bankName: row.bank_name ?? undefined,
  accountHolder: row.account_holder ?? undefined,
  paymentMethod: row.payment_method ?? undefined,
  honoredYears: parseHonoredYears(row.honored_years),
});

export const listMembers = (page: number, limit: number): PaginatedResponse<Member> => {
  const safeLimit = Math.max(1, limit);
  const offset = Math.max(0, (page - 1) * safeLimit);

  const total = (db.prepare('SELECT COUNT(*) AS count FROM members').get() as { count: number }).count;
  const rows = db
    .prepare('SELECT * FROM members ORDER BY last_name, first_name LIMIT ? OFFSET ?')
    .all(safeLimit, offset) as unknown as MemberRow[];

  return { items: rows.map(rowToMember), total };
};

export const getMember = (id: string): Member | undefined => {
  const row = db.prepare('SELECT * FROM members WHERE id = ?').get(id) as MemberRow | undefined;
  return row ? rowToMember(row) : undefined;
};

export const createMember = (params: MemberCreationParams): Member => {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO members (
      id, first_name, last_name, email, phone, mobile, birthday, address,
      is_family_membership, family_group_id, status, source,
      application_registration_id, notes, member_since, external_id,
      iban_encrypted, bic, bank_name, account_holder, payment_method
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    params.firstName,
    params.lastName,
    params.email ?? null,
    params.phone ?? null,
    params.mobile ?? null,
    params.birthday ?? null,
    params.address ?? null,
    params.isFamilyMembership ? 1 : 0,
    params.familyGroupId ?? null,
    params.status,
    params.source,
    params.applicationRegistrationId ?? null,
    params.notes ?? null,
    params.memberSince ?? null,
    params.externalId ?? null,
    params.iban ? encryptField(params.iban) : null,
    params.bic ?? null,
    params.bankName ?? null,
    params.accountHolder ?? null,
    params.paymentMethod ?? null,
  );
  // Re-fetch rather than trusting `{ id, ...params }` - honoredYears is
  // deliberately not part of MemberCreationParams (only markHonored() sets
  // it, an ordinary save must never touch it), so the input params alone
  // would misreport it as undefined instead of the column's real default.
  return getMember(id) as Member;
};

export const updateMember = (id: string, params: MemberCreationParams): Member | undefined => {
  const result = db
    .prepare(
      `UPDATE members SET
        first_name = ?, last_name = ?, email = ?, phone = ?, mobile = ?, birthday = ?, address = ?,
        is_family_membership = ?, family_group_id = ?, status = ?, source = ?,
        application_registration_id = ?, notes = ?, member_since = ?, external_id = ?,
        iban_encrypted = ?, bic = ?, bank_name = ?, account_holder = ?, payment_method = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = ?`,
    )
    .run(
      params.firstName,
      params.lastName,
      params.email ?? null,
      params.phone ?? null,
      params.mobile ?? null,
      params.birthday ?? null,
      params.address ?? null,
      params.isFamilyMembership ? 1 : 0,
      params.familyGroupId ?? null,
      params.status,
      params.source,
      params.applicationRegistrationId ?? null,
      params.notes ?? null,
      params.memberSince ?? null,
      params.externalId ?? null,
      params.iban ? encryptField(params.iban) : null,
      params.bic ?? null,
      params.bankName ?? null,
      params.accountHolder ?? null,
      params.paymentMethod ?? null,
      id,
    );
  if (result.changes === 0) return undefined;
  // See createMember() - re-fetch so honoredYears (never part of an
  // ordinary save) reflects what's actually still in the DB, not undefined.
  return getMember(id);
};

export const deleteMember = (id: string): boolean => {
  const result = db.prepare('DELETE FROM members WHERE id = ?').run(id);
  return result.changes > 0;
};

// Whether an email already belongs to a member - used by the trip-registration
// roster (Phase 3) to flag a registrant as a known member without exposing
// the full member list to whoever is just managing that roster.
export const findMemberByEmail = (email: string): Member | undefined => {
  const row = db.prepare('SELECT * FROM members WHERE email = ? COLLATE NOCASE').get(email) as
    | MemberRow
    | undefined;
  return row ? rowToMember(row) : undefined;
};

// Match key for the JSON importer (members-import-service.ts) - the
// legacy membership number, if the imported record carries one.
export const findMemberByExternalId = (externalId: string): Member | undefined => {
  const row = db.prepare('SELECT * FROM members WHERE external_id = ?').get(externalId) as
    | MemberRow
    | undefined;
  return row ? rowToMember(row) : undefined;
};

// Leading "YYYY" of an ISO date string, read directly rather than via
// `new Date(...).getFullYear()` - the latter parses date-only strings as
// UTC midnight, which can shift into the wrong calendar year for
// dates near Dec 31/Jan 1 depending on the server's local timezone.
const yearOf = (isoDate: string): number | null => {
  const match = /^(\d{4})/.exec(isoDate);
  return match ? Number(match[1]) : null;
};

// Jubiläumsfunktion: for each requested year-count N, everyone who has been
// a member for *at least* N years as of the reference date (memberSince
// year <= referenceYear - N) and hasn't been marked honored for that
// specific N yet - a calendar-year comparison, not an exact day-of-year
// one, matching how a Vereinsjubiläum is actually celebrated. Someone
// entitled to both 25 and 40 years but only honored for 25 still shows up
// under a 40-years query - each year-count is tracked independently.
export const getAnniversaries = (referenceDate: string, years: number[]): AnniversaryGroup[] => {
  const refYear = yearOf(referenceDate) ?? new Date().getFullYear();
  const members = (db.prepare('SELECT * FROM members ORDER BY last_name, first_name').all() as unknown as MemberRow[]).map(
    rowToMember,
  );

  return years.map((n) => {
    const cutoffYear = refYear - n;
    return {
      years: n,
      cutoffYear,
      members: members.filter((m) => {
        const joinYear = m.memberSince ? yearOf(m.memberSince) : null;
        return joinYear !== null && joinYear <= cutoffYear && !m.honoredYears?.includes(n);
      }),
    };
  });
};

// Marks a member as honored for a given year-count (Jubiläumsfunktion) -
// idempotent, adding an already-present year is a no-op.
export const markHonored = (id: string, years: number): Member | undefined => {
  const member = getMember(id);
  if (!member) return undefined;
  if (member.honoredYears?.includes(years)) return member;

  const honoredYears = [...(member.honoredYears ?? []), years].sort((a, b) => a - b);
  db.prepare(
    `UPDATE members SET honored_years = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`,
  ).run(JSON.stringify(honoredYears), id);
  return getMember(id);
};

// Online Mitgliedsanträge (registrations.ndjson) that haven't been promoted
// into a `members` row yet - a member's application_registration_id marks
// one as already handled, so it drops out of this list once promoted.
export const listMembershipApplications = (): MembershipApplication[] => {
  const promoted = new Set(
    (
      db
        .prepare('SELECT application_registration_id AS id FROM members WHERE application_registration_id IS NOT NULL')
        .all() as { id: string }[]
    ).map((row) => row.id),
  );

  const confirmed = listConfirmedRegistrationIds();

  return listDataByType<Omit<MembershipApplication, 'confirmed'>>('membership-registration')
    .filter((application) => !promoted.has(application.registrationId))
    .map((application) => ({ ...application, confirmed: confirmed.has(application.registrationId) }));
};
