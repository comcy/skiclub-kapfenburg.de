/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';

export interface CourseInstructor {
  sportType: string;
  level: string;
  memberId: string;
  firstName: string;
  lastName: string;
}

// Übungsleiter aller Kurse eines Tiles (nur noch aktive Lehrteam-Mitglieder).
export const listInstructors = (tileId: string): CourseInstructor[] =>
  (
    db
      .prepare(
        `SELECT ci.sport_type, ci.level, ci.member_id, m.first_name, m.last_name
         FROM course_instructors ci JOIN members m ON m.id = ci.member_id
         WHERE ci.tile_id = ? AND m.is_teaching_team = 1 AND m.status = 'active'
         ORDER BY ci.sport_type, ci.level, m.last_name, m.first_name`,
      )
      .all(tileId) as unknown as {
      sport_type: string;
      level: string;
      member_id: string;
      first_name: string;
      last_name: string;
    }[]
  ).map((r) => ({
    sportType: r.sport_type,
    level: r.level,
    memberId: r.member_id,
    firstName: r.first_name,
    lastName: r.last_name,
  }));

// Ersetzt die Übungsleiter eines Kurses. Gibt false zurück, wenn eine ID kein aktives Lehrteam-Mitglied ist.
export const setInstructors = (tileId: string, sportType: string, level: string, memberIds: string[]): boolean => {
  const unique = [...new Set(memberIds)];
  const check = db.prepare("SELECT 1 FROM members WHERE id = ? AND is_teaching_team = 1 AND status = 'active'");
  if (!unique.every((id) => check.get(id))) return false;
  db.prepare('DELETE FROM course_instructors WHERE tile_id = ? AND sport_type = ? AND level = ?').run(
    tileId,
    sportType,
    level,
  );
  const insert = db.prepare(
    'INSERT INTO course_instructors (tile_id, sport_type, level, member_id) VALUES (?, ?, ?, ?)',
  );
  for (const id of unique) insert.run(tileId, sportType, level, id);
  return true;
};
