/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomBytes } from 'node:crypto';
import { db } from '../db/connection.js';
import { Tile } from '../domain/tile.js';
import { TripRegistration } from '../domain/trip-registration.js';
import { hashToken } from './auth-service.js';
import { getRegistration, getRegistrationGroup } from './trip-registrations-service.js';

// Storno-Link (Issue #235): Der Token gehört zur Anmeldung des Hauptanmelders und gilt für ihn + alle über ihn Angemeldeten.
// Das Token-Geheimnis steht nur in der Mail; in der DB liegt der Hash. Kein Ablaufdatum - die Frist ergibt sich aus
// tile.registrationDeadline (isCancelOpen), nach Stornierung bleibt der Link nur als Anzeige nutzbar.

export const createCancelToken = (contactRegistrationId: string): string => {
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO trip_cancel_tokens (token_hash, registration_id) VALUES (?, ?)').run(
    hashToken(token),
    contactRegistrationId,
  );
  return token;
};

export const findGroupByToken = (
  token: string,
): { contact: TripRegistration; members: TripRegistration[] } | undefined => {
  const row = db.prepare('SELECT registration_id AS id FROM trip_cancel_tokens WHERE token_hash = ?').get(hashToken(token)) as
    | { id: string }
    | undefined;
  const registration = row && getRegistration(row.id);
  return registration ? getRegistrationGroup(registration) : undefined;
};

const berlinToday = (now: Date): string => now.toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });

// Frist = bis einschließlich Anmeldeschluss-Tag (Berlin). Kein Anmeldeschluss gesetzt = keine Sperre.
export const isCancelOpen = (tile: Pick<Tile, 'registrationDeadline'>, now: Date = new Date()): boolean =>
  !tile.registrationDeadline || berlinToday(now) <= tile.registrationDeadline;

// Storniert nur Personen dieser Gruppe, die noch nicht storniert sind; gibt die tatsächlich geänderten zurück.
export const cancelGroupMembers = (members: TripRegistration[], ids: string[]): TripRegistration[] => {
  const targets = members.filter((m) => ids.includes(m.id) && m.status !== 'cancelled');
  const stmt = db.prepare(
    "UPDATE trip_registrations SET status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
  );
  for (const t of targets) stmt.run(t.id);
  return targets;
};
