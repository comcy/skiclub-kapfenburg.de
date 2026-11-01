/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';
import { listMembershipApplications } from './members-service.js';

export interface NewsSummary {
  // Basis ("neu seit"), ISO - null/leer wird wie "jetzt" behandelt (nichts neu).
  since: string;
  trips: { total: number; byTile: Record<string, number> };
  courses: { total: number; byTile: Record<string, number> };
  // null = keine Berechtigung (members:manage), nicht "0".
  applications: number | null;
  // Pro Liste (tileId) der Zeitpunkt, an dem dieser Admin sie zuletzt geöffnet hat.
  seen: Record<string, string>;
}

// Neu = nach `since` UND nach dem letzten Öffnen der jeweiligen Liste durch diesen Admin.
const countByTile = (table: 'trip_registrations' | 'course_registrations', since: string, userId: string) => {
  const rows = db
    .prepare(
      `SELECT r.tile_id AS tileId, COUNT(*) AS count
       FROM ${table} r
       LEFT JOIN tile_seen s ON s.tile_id = r.tile_id AND s.user_id = ?
       WHERE r.created_at > ? AND (s.seen_at IS NULL OR r.created_at > s.seen_at)
         AND r.tile_id IN (SELECT id FROM tiles WHERE archived_at IS NULL)
       GROUP BY r.tile_id`,
    )
    .all(userId, since) as { tileId: string; count: number }[];
  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byTile: Object.fromEntries(rows.map((row) => [row.tileId, row.count])),
  };
};

// Was seit `since` neu hinzugekommen ist - Zaehler fuer die Dashboard-Widgets und die
// "+N neu"-Anzeige in den Uebersichten. created_at und timestamp sind ISO-Strings im
// selben Format wie news_since, der Vergleich ist ein reiner String-Vergleich.
export const getNewsSummary = (userId: string, newsSince: string | null, canSeeApplications: boolean): NewsSummary => {
  const since = newsSince ?? new Date().toISOString();
  return {
    since,
    trips: countByTile('trip_registrations', since, userId),
    courses: countByTile('course_registrations', since, userId),
    applications: canSeeApplications
      ? listMembershipApplications().filter((application) => application.timestamp > since).length
      : null,
    seen: Object.fromEntries(
      (db.prepare('SELECT tile_id AS tileId, seen_at AS seenAt FROM tile_seen WHERE user_id = ?').all(userId) as {
        tileId: string;
        seenAt: string;
      }[]).map((row) => [row.tileId, row.seenAt]),
    ),
  };
};

// Liste geöffnet: ab jetzt gilt Älteres als gesehen. Gibt den vorherigen Zeitpunkt zurück, damit die offene
// Liste ihre "Neu"-Markierungen für diesen Besuch noch zeigen kann. ponytail: server-"jetzt" statt Zeitpunkt der
// neuesten geladenen Anmeldung - eine in Millisekunden dazwischen eintreffende Anmeldung würde als gesehen gelten.
export const markTileSeen = (userId: string, tileId: string): string | null => {
  const previous = db.prepare('SELECT seen_at AS seenAt FROM tile_seen WHERE user_id = ? AND tile_id = ?').get(userId, tileId) as
    | { seenAt: string }
    | undefined;
  db.prepare(
    `INSERT INTO tile_seen (user_id, tile_id, seen_at) VALUES (?, ?, ?)
     ON CONFLICT (user_id, tile_id) DO UPDATE SET seen_at = excluded.seen_at`,
  ).run(userId, tileId, new Date().toISOString());
  return previous?.seenAt ?? null;
};
