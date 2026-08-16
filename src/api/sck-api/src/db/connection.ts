/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { dataDir } from '../services/data-service.js';

// ponytail: node:sqlite is built into the Node versions this repo already
// requires (engines pins 22.22.3 / 24.15.0 / >=26, where it ships unflagged)
// — no sqlite driver dependency needed.
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(dataDir, 'sck-api.sqlite3');

if (dbPath !== ':memory:' && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS tiles (
    id TEXT PRIMARY KEY,
    order_index INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('info', 'event', 'course')),
    title TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    sub_title TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    image_id TEXT,
    image_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('open', 'canceled', 'bookedUp')) DEFAULT 'open',
    expiration TEXT NOT NULL DEFAULT '',
    behavior TEXT NOT NULL CHECK (behavior IN ('view', 'click')) DEFAULT 'view',
    actions TEXT NOT NULL DEFAULT '[]',
    download_action_link TEXT,
    avatar TEXT,
    visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS boardings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS trip_boardings (
    tile_id TEXT NOT NULL REFERENCES tiles (id) ON DELETE CASCADE,
    boarding_id TEXT NOT NULL REFERENCES boardings (id) ON DELETE CASCADE,
    PRIMARY KEY (tile_id, boarding_id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_login_at TEXT
  );

  -- Multi-valued, granular permission grants (Recht ueber "read"/"editor"
  -- hinaus) -- e.g. 'tiles:write', 'boardings:write', 'users:manage',
  -- 'sepa:read'. Baseline read access needs no row: any authenticated user
  -- can read, grants here are for elevated / sensitive actions only.
  CREATE TABLE IF NOT EXISTS permissions (
    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    permission TEXT NOT NULL CHECK (
      permission IN ('tiles:write', 'boardings:write', 'users:manage', 'sepa:read')
    ),
    granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    granted_by TEXT,
    PRIMARY KEY (user_id, permission)
  );

  CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL COLLATE NOCASE,
    token_hash TEXT NOT NULL UNIQUE,
    invited_by TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    expires_at TEXT NOT NULL,
    accepted_at TEXT
  );

  -- Auth plumbing (not itemized in the brief's table list, but required to
  -- back the magic-link + session model it asks for): short-lived opaque
  -- tokens for a pending magic-link login, and issued session tokens.
  CREATE TABLE IF NOT EXISTS magic_link_tokens (
    token_hash TEXT PRIMARY KEY,
    email TEXT NOT NULL COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    expires_at TEXT NOT NULL,
    used_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    expires_at TEXT NOT NULL
  );

  -- Owned by the parallel membership/SEPA feature; kept empty and prepared
  -- here so the 'sepa:read' permission has something real to gate.
  CREATE TABLE IF NOT EXISTS sepa_data (
    id TEXT PRIMARY KEY,
    member_id TEXT,
    account_holder TEXT,
    iban TEXT,
    bic TEXT,
    mandate_reference TEXT,
    mandate_date TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`);
