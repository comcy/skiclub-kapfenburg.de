/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import {
  MemberImportApplyResult,
  MemberImportCollision,
  MemberImportCollisionOverride,
  MemberImportDiffField,
  MemberImportPreview,
  MemberImportRecord,
} from '../domain/member-import.js';
import { Member, MemberCreationParams } from '../domain/member.js';
import { createMember, findMemberByEmail, findMemberByExternalId, updateMember } from './members-service.js';

// Fields the importer actually maps and can therefore compare/overwrite -
// keyed by the MemberCreationParams property, value is the German label
// shown in the admin's Gegenüberstellung.
const FIELD_LABELS: Record<string, string> = {
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail',
  phone: 'Telefon',
  mobile: 'Mobil',
  address: 'Adresse',
  memberSince: 'Eintrittsdatum',
  notes: 'Notizen',
  bankName: 'Bank',
  bic: 'BIC',
  iban: 'IBAN',
  accountHolder: 'Kontoinhaber',
  paymentMethod: 'Zahlungsbedingung',
};

const GERMAN_DATE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

// "26.03.1985" -> "1985-03-26". Returns undefined for anything else rather
// than guessing - an unparsable Eintrittsdatum just doesn't get mapped, it
// isn't invented from a bad format.
export const parseGermanDate = (value: string | undefined): string | undefined => {
  const match = GERMAN_DATE.exec(value?.trim() ?? '');
  if (!match) return undefined;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Adresse_Raw is a legacy multi-line dump only kept around in the source
// system for reference - Adresse is already the clean, single-line
// version this app actually uses, so Adresse_Raw is deliberately dropped.
export const mapImportRecord = (record: MemberImportRecord): MemberCreationParams => {
  const nameParts = (record.Name ?? '').trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') || firstName;
  const tel2 = record.Kommunikation?.['Tel 2']?.trim();

  return {
    firstName,
    lastName,
    email: record.Kommunikation?.['E-Mail']?.trim() || undefined,
    phone: record.Kommunikation?.['Tel 1']?.trim() || undefined,
    mobile: record.Kommunikation?.Mobil?.trim() || undefined,
    address: record.Adresse?.trim() || undefined,
    memberSince: parseGermanDate(record.Eintrittsdatum),
    externalId: record.Nr?.trim() || undefined,
    bankName: record.Bankdaten?.Bank?.trim() || undefined,
    bic: record.Bankdaten?.BIC?.trim() || undefined,
    iban: record.Bankdaten?.IBAN?.trim() || undefined,
    accountHolder: record.Bankdaten?.Kontoinhaber?.trim() || undefined,
    paymentMethod: record.Zahlungsbedingung?.trim() || undefined,
    notes: tel2 ? `Tel 2: ${tel2}` : undefined,
    isFamilyMembership: false,
    status: 'active',
    source: 'imported',
  };
};

const findExistingMatch = (mapped: MemberCreationParams): Member | undefined => {
  if (mapped.externalId) {
    const byExternalId = findMemberByExternalId(mapped.externalId);
    if (byExternalId) return byExternalId;
  }
  if (mapped.email) {
    return findMemberByEmail(mapped.email);
  }
  return undefined;
};

interface CachedPreview {
  createdAt: number;
  neu: MemberCreationParams[];
  kollisionen: MemberImportCollision[];
}

// ponytail: single-process in-memory cache, lost on server restart - fine
// for a short synchronous admin workflow (upload -> review -> confirm, all
// in one sitting); upgrade to a DB-backed draft if imports ever need to
// survive a restart or span multiple admins.
const previewCache = new Map<string, CachedPreview>();
const PREVIEW_TTL_MS = 60 * 60 * 1000;

const pruneCache = (): void => {
  const cutoff = Date.now() - PREVIEW_TTL_MS;
  for (const [id, cached] of previewCache) {
    if (cached.createdAt < cutoff) previewCache.delete(id);
  }
};

export const previewImport = (records: MemberImportRecord[]): MemberImportPreview => {
  const neu: MemberCreationParams[] = [];
  const kollisionen: MemberImportCollision[] = [];
  let identisch = 0;

  for (const record of records) {
    const mapped = mapImportRecord(record);
    const existing = findExistingMatch(mapped);

    if (!existing) {
      neu.push(mapped);
      continue;
    }

    // A field only counts as a diff if the import actually supplies a
    // value for it and that value differs - a field the import leaves
    // empty never overwrites already-known data, matching the "ergänzend"
    // (additive) behavior asked for.
    const diffFields: MemberImportDiffField[] = [];
    for (const [field, label] of Object.entries(FIELD_LABELS)) {
      const incoming = (mapped as unknown as Record<string, unknown>)[field];
      const current = (existing as unknown as Record<string, unknown>)[field];
      if (incoming !== undefined && incoming !== current) {
        diffFields.push({ field, label, existing: current, incoming });
      }
    }

    if (diffFields.length === 0) {
      identisch += 1;
    } else {
      kollisionen.push({ memberId: existing.id, mapped, existing, diffFields });
    }
  }

  const importId = randomUUID();
  pruneCache();
  previewCache.set(importId, { createdAt: Date.now(), neu, kollisionen });

  return { importId, neu, identisch, kollisionen };
};

// Creates every "neu" record unconditionally (that list is a pure overview,
// no per-record decision needed) and applies only the field overrides the
// admin explicitly chose for a collision - a collision absent from
// `collisionOverrides` is left untouched (the default "bestehend behalten").
export const applyImport = (
  importId: string,
  collisionOverrides: MemberImportCollisionOverride[],
): MemberImportApplyResult => {
  const cached = previewCache.get(importId);
  if (!cached) {
    throw new Error('Import-Vorschau nicht gefunden oder abgelaufen - bitte erneut hochladen.');
  }

  let created = 0;
  let updated = 0;

  // node:sqlite's DatabaseSync has no .transaction() helper (unlike
  // better-sqlite3) - manual BEGIN/COMMIT/ROLLBACK, same pattern as the
  // schema migrations in db/connection.ts, so a failure partway through a
  // large import doesn't leave half the batch written.
  db.exec('BEGIN');
  try {
    for (const record of cached.neu) {
      createMember(record);
      created += 1;
    }

    for (const override of collisionOverrides) {
      const collision = cached.kollisionen.find((k) => k.memberId === override.memberId);
      if (!collision || Object.keys(override.fields).length === 0) continue;
      const merged: MemberCreationParams = { ...collision.existing, ...override.fields };
      updateMember(override.memberId, merged);
      updated += 1;
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  previewCache.delete(importId);
  return { created, updated };
};
