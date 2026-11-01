/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';

export interface MemberMatchInput {
  email?: string;
  firstName: string;
  lastName: string;
  birthday?: string;
}

export interface VerifiedPerson {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
  memberId: string | null;
  createdBy: string | null;
  createdAt: string;
  revokedAt: string | null;
}

interface Candidate {
  key: string; // gleiche Person (Mitglied bzw. verknüpfte verifizierte Person) = gleicher key
  memberId: string | null;
  birthday: string | null;
}

// Kandidaten mit gleichem Namen: Mitglieder + aktive verifizierte Personen.
const candidatesByName = (firstName: string, lastName: string): Candidate[] => {
  const members = db
    .prepare(
      `SELECT id, birthday FROM members
       WHERE first_name = ? COLLATE NOCASE AND last_name = ? COLLATE NOCASE AND status = 'active'`,
    )
    .all(firstName.trim(), lastName.trim()) as { id: string; birthday: string | null }[];
  const verified = db
    .prepare(
      `SELECT id, member_id, birthday FROM verified_persons
       WHERE first_name = ? COLLATE NOCASE AND last_name = ? COLLATE NOCASE AND revoked_at IS NULL`,
    )
    .all(firstName.trim(), lastName.trim()) as { id: string; member_id: string | null; birthday: string | null }[];
  return [
    ...members.map((m) => ({ key: m.id, memberId: m.id, birthday: m.birthday })),
    ...verified.map((v) => ({ key: v.member_id ?? `v:${v.id}`, memberId: v.member_id, birthday: v.birthday })),
  ];
};

const findMemberByEmailAndName = (email: string, firstName: string, lastName: string): string | undefined => {
  const withEmail = db
    .prepare('SELECT id, family_group_id FROM members WHERE email = ? COLLATE NOCASE')
    .all(email.trim()) as { id: string; family_group_id: string | null }[];
  for (const owner of withEmail) {
    const row = db
      .prepare(
        `SELECT id FROM members
         WHERE first_name = ? COLLATE NOCASE AND last_name = ? COLLATE NOCASE
           AND (id = ? OR (family_group_id IS NOT NULL AND family_group_id = ?))`,
      )
      .get(firstName.trim(), lastName.trim(), owner.id, owner.family_group_id) as { id: string } | undefined;
    if (row) return row.id;
  }
  return undefined;
};

// Reihenfolge: E-Mail + Name -> Name + Geburtsdatum -> (nur Admin) eindeutiger Name.
// Das Ergebnis wird immer serverseitig abgeleitet, nie vom Client übernommen.
// `allowNameOnly` nur für Admin-Anlage: öffentlich reicht ein fremder Name nicht als Mitgliedsnachweis.
export const resolveMember = (
  input: MemberMatchInput,
  allowNameOnly: boolean,
): { id: string | null; isMember: number } => {
  if (!input.firstName?.trim() || !input.lastName?.trim()) return { id: null, isMember: 0 };
  // E-Mail allein reicht nicht (Familien teilen sich eine Adresse): zusätzlich muss der Name zu dem Mitglied
  // mit dieser E-Mail oder zu einem Mitglied seiner Familiengruppe passen.
  const byEmail = input.email ? findMemberByEmailAndName(input.email, input.firstName, input.lastName) : undefined;
  if (byEmail) return { id: byEmail, isMember: 1 };
  const candidates = candidatesByName(input.firstName, input.lastName);

  if (input.birthday) {
    const exact = candidates.find((c) => c.birthday === input.birthday);
    if (exact) return { id: exact.memberId, isMember: 1 };
  }

  if (allowNameOnly) {
    // Bekannte, abweichende Geburtsdaten schließen aus; mehrdeutig (z.B. Vater/Sohn) -> kein Auto-Match.
    const open = candidates.filter((c) => !c.birthday || !input.birthday);
    const distinct = new Set(open.map((c) => c.key));
    if (distinct.size === 1) return { id: open[0].memberId, isMember: 1 };
  }
  return { id: null, isMember: 0 };
};

const rowToPerson = (row: any): VerifiedPerson => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  birthday: row.birthday,
  memberId: row.member_id,
  createdBy: row.created_by,
  createdAt: row.created_at,
  revokedAt: row.revoked_at,
});

export const createVerifiedPerson = (
  params: { firstName: string; lastName: string; birthday?: string; memberId?: string },
  createdBy?: string,
): VerifiedPerson => {
  const id = randomUUID();
  db.prepare(
    'INSERT INTO verified_persons (id, first_name, last_name, birthday, member_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(id, params.firstName.trim(), params.lastName.trim(), params.birthday ?? null, params.memberId ?? null, createdBy ?? null);
  return rowToPerson(db.prepare('SELECT * FROM verified_persons WHERE id = ?').get(id));
};

// Widerruf statt Löschen; Anmeldungen, die bereits als Mitglied markiert sind, bleiben unberührt.
export const revokeVerifiedPerson = (id: string): VerifiedPerson | undefined => {
  const result = db
    .prepare("UPDATE verified_persons SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND revoked_at IS NULL")
    .run(id);
  if (result.changes === 0) return undefined;
  return rowToPerson(db.prepare('SELECT * FROM verified_persons WHERE id = ?').get(id));
};

export const listVerifiedPersons = (): VerifiedPerson[] =>
  (db.prepare('SELECT * FROM verified_persons WHERE revoked_at IS NULL ORDER BY last_name, first_name').all() as any[]).map(
    rowToPerson,
  );
