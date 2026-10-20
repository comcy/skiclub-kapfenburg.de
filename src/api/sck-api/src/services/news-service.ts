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
}

const countByTile = (table: 'trip_registrations' | 'course_registrations', since: string) => {
  const rows = db
    .prepare(`SELECT tile_id AS tileId, COUNT(*) AS count FROM ${table} WHERE created_at > ? GROUP BY tile_id`)
    .all(since) as { tileId: string; count: number }[];
  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byTile: Object.fromEntries(rows.map((row) => [row.tileId, row.count])),
  };
};

// Was seit `since` neu hinzugekommen ist - Zaehler fuer die Dashboard-Widgets und die
// "+N neu"-Anzeige in den Uebersichten. created_at und timestamp sind ISO-Strings im
// selben Format wie news_since, der Vergleich ist ein reiner String-Vergleich.
export const getNewsSummary = (newsSince: string | null, canSeeApplications: boolean): NewsSummary => {
  const since = newsSince ?? new Date().toISOString();
  return {
    since,
    trips: countByTile('trip_registrations', since),
    courses: countByTile('course_registrations', since),
    applications: canSeeApplications
      ? listMembershipApplications().filter((application) => application.timestamp > since).length
      : null,
  };
};
