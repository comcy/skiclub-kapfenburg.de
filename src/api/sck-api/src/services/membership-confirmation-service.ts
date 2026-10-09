/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { createHash, randomBytes } from 'node:crypto';
import { db } from '../db/connection.js';

// Double-opt-in for membership registrations (see membership-controller.ts).
// Same token shape as auth-service.ts's magic-link tokens, keyed by
// registration_id instead of email since registrations.ndjson is
// append-only and has no place of its own to store confirmation state.
const CONFIRMATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage - Leute checken ihre Mail nicht sofort

const nowIso = (): string => new Date().toISOString();
const addMs = (ms: number): string => new Date(Date.now() + ms).toISOString();

const generateToken = (): string => randomBytes(32).toString('hex');
const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

export const createConfirmationToken = (registrationId: string): string => {
  const token = generateToken();
  db.prepare(
    'INSERT INTO membership_confirmation_tokens (token_hash, registration_id, expires_at) VALUES (?, ?, ?)',
  ).run(hashToken(token), registrationId, addMs(CONFIRMATION_TTL_MS));
  return token;
};

// Idempotent: a second click on the same link (double-click, a mail
// client's link-preview bot fetching it early) still succeeds instead of
// erroring - alreadyConfirmed tells the caller whether this call is the
// one that should trigger the board notification mail.
export const confirmRegistration = (
  token: string,
): { registrationId: string; alreadyConfirmed: boolean } | undefined => {
  const hashed = hashToken(token);
  const row = db
    .prepare(
      'SELECT registration_id AS registrationId, confirmed_at AS confirmedAt FROM membership_confirmation_tokens WHERE token_hash = ? AND expires_at > ?',
    )
    .get(hashed, nowIso()) as { registrationId: string; confirmedAt: string | null } | undefined;
  if (!row) return undefined;

  const alreadyConfirmed = row.confirmedAt !== null;
  if (!alreadyConfirmed) {
    db.prepare('UPDATE membership_confirmation_tokens SET confirmed_at = ? WHERE token_hash = ?').run(
      nowIso(),
      hashed,
    );
  }
  return { registrationId: row.registrationId, alreadyConfirmed };
};

export const listConfirmedRegistrationIds = (): Set<string> =>
  new Set(
    (
      db.prepare('SELECT registration_id AS id FROM membership_confirmation_tokens WHERE confirmed_at IS NOT NULL').all() as {
        id: string;
      }[]
    ).map((row) => row.id),
  );
