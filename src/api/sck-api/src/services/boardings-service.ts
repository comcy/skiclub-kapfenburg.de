/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { Boarding, BoardingCreationParams } from '../domain/boarding.js';
import { PaginatedResponse } from '../domain/tile.js';

interface BoardingRow {
  id: string;
  name: string;
}

const rowToBoarding = (row: BoardingRow): Boarding => ({ id: row.id, name: row.name });

export const listBoardings = (page: number, limit: number): PaginatedResponse<Boarding> => {
  const safeLimit = Math.max(1, limit);
  const offset = Math.max(0, (page - 1) * safeLimit);

  const total = (db.prepare('SELECT COUNT(*) AS count FROM boardings').get() as { count: number }).count;
  const rows = db
    .prepare('SELECT * FROM boardings ORDER BY name LIMIT ? OFFSET ?')
    .all(safeLimit, offset) as unknown as BoardingRow[];

  return { items: rows.map(rowToBoarding), total };
};

export const getBoarding = (id: string): Boarding | undefined => {
  const row = db.prepare('SELECT * FROM boardings WHERE id = ?').get(id) as BoardingRow | undefined;
  return row ? rowToBoarding(row) : undefined;
};

export const createBoarding = (params: BoardingCreationParams): Boarding => {
  const id = randomUUID();
  db.prepare('INSERT INTO boardings (id, name) VALUES (?, ?)').run(id, params.name);
  return { id, name: params.name };
};

export const updateBoarding = (id: string, params: BoardingCreationParams): Boarding | undefined => {
  const result = db.prepare('UPDATE boardings SET name = ? WHERE id = ?').run(params.name, id);
  if (result.changes === 0) return undefined;
  return { id, name: params.name };
};

export const deleteBoarding = (id: string): boolean => {
  const result = db.prepare('DELETE FROM boardings WHERE id = ?').run(id);
  return result.changes > 0;
};
