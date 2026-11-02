/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';
import { hashToken } from './auth-service.js';
import { findMemberByEmail } from './members-service.js';

// Aktiv = in den letzten 5 Minuten ein Heartbeat (Admin-App sendet jede Minute).
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export interface OnlineUser {
  userId: string;
  name: string;
  initials: string;
  page?: string;
  lastSeenAt: string;
}

// Anzeigename aus der Mitgliederliste (Name zur E-Mail), sonst aus dem lokalen Teil der E-Mail
// ("christian.silfang@..." -> "Christian Silfang").
const displayName = (email: string): { name: string; initials: string } => {
  const member = findMemberByEmail(email);
  const [first, last] = member
    ? [member.firstName, member.lastName]
    : email
        .split('@')[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  const name = [first, last].filter(Boolean).join(' ') || email;
  return { name, initials: ((first?.[0] ?? '') + (last?.[0] ?? '')).toUpperCase() || email[0].toUpperCase() };
};

export const heartbeat = (token: string, page: string | undefined): void => {
  db.prepare("UPDATE sessions SET last_seen_at = ?, page = ? WHERE token_hash = ?").run(
    new Date().toISOString(),
    page ? page.split('?')[0].slice(0, 120) : null,
    hashToken(token),
  );
};

// Pro Nutzer die zuletzt aktive Session, neueste zuerst.
export const listOnline = (): OnlineUser[] => {
  const since = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();
  const rows = db
    .prepare(
      `SELECT u.id AS userId, u.email AS email, s.page AS page, s.last_seen_at AS lastSeenAt
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.last_seen_at > ? AND s.expires_at > ?
       ORDER BY s.last_seen_at DESC`,
    )
    .all(since, new Date().toISOString()) as unknown as { userId: string; email: string; page: string | null; lastSeenAt: string }[];
  const seen = new Set<string>();
  const result: OnlineUser[] = [];
  for (const row of rows) {
    if (seen.has(row.userId)) continue;
    seen.add(row.userId);
    result.push({ userId: row.userId, ...displayName(row.email), page: row.page ?? undefined, lastSeenAt: row.lastSeenAt });
  }
  return result;
};
