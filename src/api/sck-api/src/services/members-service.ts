/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { Member, MemberCreationParams, MembershipApplication } from '../domain/member.js';
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
}

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
  return { id, ...params };
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
  return { id, ...params };
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
