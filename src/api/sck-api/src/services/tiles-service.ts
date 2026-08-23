/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { EXTRA_FIELD_KEYS, PaginatedResponse, Tile, TileCreationParams } from '../domain/tile.js';

interface TileRow {
  id: string;
  order_index: number;
  type: string;
  title: string;
  date: string;
  sub_title: string;
  image: string;
  image_id: string | null;
  image_description: string;
  description: string;
  status: string;
  expiration: string;
  behavior: string;
  actions: string;
  download_action_link: string | null;
  avatar: string | null;
  visible: number;
  extra_json: string;
  created_at: string;
  updated_at: string;
  capacity: number | null;
  organizer_user_id: string | null;
}

// Picks only the whitelisted passthrough fields (see EXTRA_FIELD_KEYS) into
// the blob stored in `tiles.extra_json` — keeps arbitrary client payload
// keys out of what gets persisted.
export const extractExtraFields = (params: Partial<Tile>): string => {
  const extra: Partial<Record<(typeof EXTRA_FIELD_KEYS)[number], unknown>> = {};
  for (const key of EXTRA_FIELD_KEYS) {
    if (params[key] !== undefined) extra[key] = params[key];
  }
  return JSON.stringify(extra);
};

// Whitelist of client-facing sort keys -> real columns. Never interpolate a
// client-supplied column name straight into SQL.
const SORTABLE_COLUMNS: Record<string, string> = {
  order: 'order_index',
  title: 'title',
  subTitle: 'sub_title',
  type: 'type',
  status: 'status',
  behavior: 'behavior',
  date: 'date',
  expiration: 'expiration',
};

const getBoardingNamesForTile = (tileId: string): string[] => {
  const rows = db
    .prepare(
      `SELECT b.name AS name FROM trip_boardings tb
       JOIN boardings b ON b.id = tb.boarding_id
       WHERE tb.tile_id = ?
       ORDER BY b.name`,
    )
    .all(tileId) as { name: string }[];
  return rows.map((r) => r.name);
};

const rowToTile = (row: TileRow): Tile => {
  const expiration = row.expiration ? new Date(row.expiration) : null;
  const extra = JSON.parse(row.extra_json || '{}') as Partial<Tile>;
  return {
    id: row.id,
    order: row.order_index,
    type: row.type as Tile['type'],
    title: row.title,
    date: row.date,
    subTitle: row.sub_title,
    image: row.image,
    imageId: row.image_id ?? undefined,
    imageDescription: row.image_description,
    description: row.description,
    status: row.status as Tile['status'],
    expiration: row.expiration,
    behavior: row.behavior as Tile['behavior'],
    boardings: getBoardingNamesForTile(row.id),
    actions: JSON.parse(row.actions) as Tile['actions'],
    downloadActionLink: row.download_action_link ?? undefined,
    avatar: row.avatar ?? undefined,
    visible: row.visible === 1,
    expired: expiration ? expiration.getTime() < Date.now() : false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    capacity: row.capacity ?? undefined,
    organizerUserId: row.organizer_user_id ?? undefined,
    ...extra,
  };
};

// Sets the boarding assignment for a tile from a list of boarding *names*
// (the admin UI's multi-select uses names as the value, matching the legacy
// Trip.availableBoardings: string[] this replaces). Unknown names are
// ignored rather than silently creating catalog entries.
export const setTileBoardings = (tileId: string, boardingNames: string[]): void => {
  const names = [...new Set(boardingNames.filter((n) => n && n.trim().length > 0))];
  const placeholders = names.map(() => '?').join(',');
  const boardingIds = names.length
    ? (db.prepare(`SELECT id FROM boardings WHERE name IN (${placeholders})`).all(...names) as { id: string }[]).map(
        (r) => r.id,
      )
    : [];

  db.prepare('DELETE FROM trip_boardings WHERE tile_id = ?').run(tileId);
  const insert = db.prepare('INSERT INTO trip_boardings (tile_id, boarding_id) VALUES (?, ?)');
  for (const boardingId of boardingIds) {
    insert.run(tileId, boardingId);
  }
};

export interface ListTilesParams {
  page: number;
  limit: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  search?: string;
  type?: string;
  status?: string;
}

type SqlValue = string | number;

export const listTiles = (params: ListTilesParams): PaginatedResponse<Tile> => {
  const conditions: string[] = [];
  const values: SqlValue[] = [];

  if (params.search) {
    conditions.push('(title LIKE ? OR sub_title LIKE ? OR description LIKE ?)');
    const term = `%${params.search}%`;
    values.push(term, term, term);
  }
  if (params.type) {
    conditions.push('type = ?');
    values.push(params.type);
  }
  if (params.status) {
    conditions.push('status = ?');
    values.push(params.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortColumn = SORTABLE_COLUMNS[params.sort ?? 'order'] ?? 'order_index';
  const direction = params.direction === 'desc' ? 'DESC' : 'ASC';
  const limit = Math.max(1, params.limit);
  const offset = Math.max(0, (params.page - 1) * limit);

  const total = (db.prepare(`SELECT COUNT(*) AS count FROM tiles ${whereClause}`).get(...values) as { count: number })
    .count;

  const rows = db
    .prepare(`SELECT * FROM tiles ${whereClause} ORDER BY ${sortColumn} ${direction} LIMIT ? OFFSET ?`)
    .all(...values, limit, offset) as unknown as TileRow[];

  return { items: rows.map(rowToTile), total };
};

export const getTile = (id: string): Tile | undefined => {
  const row = db.prepare('SELECT * FROM tiles WHERE id = ?').get(id) as TileRow | undefined;
  return row ? rowToTile(row) : undefined;
};

export const createTile = (params: TileCreationParams): Tile => {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO tiles (
      id, order_index, type, title, date, sub_title, image, image_id, image_description,
      description, status, expiration, behavior, actions, download_action_link, avatar, visible,
      capacity, organizer_user_id, extra_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    params.order ?? 0,
    params.type,
    params.title ?? '',
    params.date ?? '',
    params.subTitle ?? '',
    params.image ?? '',
    params.imageId ?? null,
    params.imageDescription ?? '',
    params.description ?? '',
    params.status,
    params.expiration ?? '',
    params.behavior,
    JSON.stringify(params.actions ?? []),
    params.downloadActionLink ?? null,
    params.avatar ?? null,
    params.visible === false ? 0 : 1,
    params.capacity ?? null,
    params.organizerUserId ?? null,
    extractExtraFields(params),
  );

  if (params.boardings?.length) {
    setTileBoardings(id, params.boardings);
  }

  return getTile(id) as Tile;
};

export const updateTile = (id: string, params: TileCreationParams): Tile | undefined => {
  const existing = db.prepare('SELECT extra_json FROM tiles WHERE id = ?').get(id) as
    | { extra_json: string }
    | undefined;
  if (!existing) return undefined;

  // The admin editor doesn't model the extra passthrough fields, so its
  // update payload never carries them — merge over the stored blob rather
  // than replacing it outright, so an ordinary admin edit doesn't silently
  // wipe a migrated tile's registration config (tripConfig/course/etc).
  const mergedExtra = JSON.stringify({
    ...JSON.parse(existing.extra_json || '{}'),
    ...JSON.parse(extractExtraFields(params)),
  });

  db.prepare(
    `UPDATE tiles SET
      order_index = ?, type = ?, title = ?, date = ?, sub_title = ?, image = ?, image_id = ?,
      image_description = ?, description = ?, status = ?, expiration = ?, behavior = ?,
      actions = ?, download_action_link = ?, avatar = ?, visible = ?,
      capacity = ?, organizer_user_id = ?, extra_json = ?,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?`,
  ).run(
    params.order ?? 0,
    params.type,
    params.title ?? '',
    params.date ?? '',
    params.subTitle ?? '',
    params.image ?? '',
    params.imageId ?? null,
    params.imageDescription ?? '',
    params.description ?? '',
    params.status,
    params.expiration ?? '',
    params.behavior,
    JSON.stringify(params.actions ?? []),
    params.downloadActionLink ?? null,
    params.avatar ?? null,
    params.visible === false ? 0 : 1,
    params.capacity ?? null,
    params.organizerUserId ?? null,
    mergedExtra,
    id,
  );

  setTileBoardings(id, params.boardings ?? []);

  return getTile(id);
};

export const deleteTile = (id: string): boolean => {
  const result = db.prepare('DELETE FROM tiles WHERE id = ?').run(id);
  return result.changes > 0;
};
