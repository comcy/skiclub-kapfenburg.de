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
    -- Opaque passthrough for the fields the richer sck-app Tile union carries
    -- (tripConfig, course, details, location, timeData, destination,
    -- additionalInformation) that the admin editor doesn't model or validate
    -- — stored as JSON so the API can round-trip them without sck-api having
    -- to mirror trips-lib's/gym-lib's types.
    extra_json TEXT NOT NULL DEFAULT '{}',
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
  -- hinaus) -- e.g. 'tiles:write', 'boardings:write', 'users:manage'.
  -- Baseline read access needs no row: any authenticated user can read,
  -- grants here are for elevated / sensitive actions only.
  CREATE TABLE IF NOT EXISTS permissions (
    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    permission TEXT NOT NULL CHECK (
      permission IN ('tiles:write', 'boardings:write', 'users:manage', 'members:manage')
    ),
    granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    granted_by TEXT,
    PRIMARY KEY (user_id, permission)
  );

  -- Curated member roster, deliberately separate from the raw
  -- registrations.ndjson application log (see members-service.ts) -- an
  -- application only becomes a member once someone here confirms it, and a
  -- member can also be entered directly (paper-form signups, no online
  -- application at all).
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT COLLATE NOCASE,
    phone TEXT,
    birthday TEXT,
    address TEXT,
    is_family_membership INTEGER NOT NULL DEFAULT 0,
    -- Shared, app-generated value (not a FK) grouping the rows of one family
    -- membership -- no separate "families" table for just that.
    family_group_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    source TEXT NOT NULL CHECK (source IN ('online', 'manual', 'paper')) DEFAULT 'manual',
    -- registrationId from registrations.ndjson, if this member was promoted
    -- from an online Mitgliedsantrag -- not a DB FK, that log lives on disk.
    application_registration_id TEXT,
    notes TEXT,
    member_since TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Admin-side registration register per Ausfahrt (Phase 3 of the
  -- trip-registration plan) -- deliberately parallel to, not replacing, the
  -- public site's Google-Sheet-based registration form. member_id/is_member
  -- are recomputed server-side from email on every write (see
  -- trip-registrations-service.ts), never trusted from the client.
  CREATE TABLE IF NOT EXISTS trip_registrations (
    id TEXT PRIMARY KEY,
    tile_id TEXT NOT NULL REFERENCES tiles (id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    member_id TEXT REFERENCES members (id) ON DELETE SET NULL,
    boarding_id TEXT REFERENCES boardings (id) ON DELETE SET NULL,
    age_category TEXT NOT NULL CHECK (age_category IN ('adult', 'youthUntil16', 'childUntil6')) DEFAULT 'adult',
    is_member INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'waitlist', 'cancelled')) DEFAULT 'confirmed',
    source TEXT NOT NULL CHECK (source IN ('manual', 'phone', 'paper', 'sheet-import')) DEFAULT 'manual',
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Kursverwaltung Runde 1: admin-side registration register per Kurs,
  -- parallel to trip_registrations but without a capacity/waitlist concept
  -- (courses aren't seat-limited the way Ausfahrten are) - see the plan.
  -- birthday/sport_type/level replace trip_registrations' boarding_id/
  -- age_category, which don't apply to courses.
  CREATE TABLE IF NOT EXISTS course_groups (
    id TEXT PRIMARY KEY,
    tile_id TEXT NOT NULL REFERENCES tiles (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    instructor_name TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS course_registrations (
    id TEXT PRIMARY KEY,
    tile_id TEXT NOT NULL REFERENCES tiles (id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    member_id TEXT REFERENCES members (id) ON DELETE SET NULL,
    birthday TEXT,
    sport_type TEXT,
    level TEXT,
    group_id TEXT REFERENCES course_groups (id) ON DELETE SET NULL,
    is_member INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled')) DEFAULT 'confirmed',
    source TEXT NOT NULL CHECK (source IN ('manual', 'sheet-import')) DEFAULT 'manual',
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Generic key-value settings, currently just the global notification BCC
  -- fallback (see settings-service.ts) - deliberately generic so future
  -- site-wide settings don't each need their own table.
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
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
`);

// CREATE TABLE IF NOT EXISTS leaves an already-existing tiles table (from a
// database created before extra_json existed) untouched, so add the column
// by hand — guarded, since SQLite has no "ADD COLUMN IF NOT EXISTS".
const tileColumns = db.prepare("SELECT name FROM pragma_table_info('tiles')").all() as { name: string }[];
if (!tileColumns.some((c) => c.name === 'extra_json')) {
  db.exec("ALTER TABLE tiles ADD COLUMN extra_json TEXT NOT NULL DEFAULT '{}';");
}

// Phase 2 of the trip-registration plan: seat capacity and an informational
// organizer reference, both plain nullable columns (no CHECK constraint
// involved, so no rebuild needed like the permissions migration above).
if (!tileColumns.some((c) => c.name === 'capacity')) {
  db.exec('ALTER TABLE tiles ADD COLUMN capacity INTEGER;');
}
if (!tileColumns.some((c) => c.name === 'organizer_user_id')) {
  db.exec('ALTER TABLE tiles ADD COLUMN organizer_user_id TEXT REFERENCES users (id) ON DELETE SET NULL;');
}

// SQLite can't ALTER a CHECK constraint, so an already-existing permissions
// table (from before 'members:manage' existed) needs a full rebuild to
// accept it — guarded by inspecting the table's stored CREATE TABLE SQL
// rather than trying an insert and catching the failure.
const permissionsTableSql = (
  db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'permissions'").get() as
    | { sql: string }
    | undefined
)?.sql;
if (permissionsTableSql && !permissionsTableSql.includes('members:manage')) {
  db.exec(`
    BEGIN;
    ALTER TABLE permissions RENAME TO permissions_old;
    CREATE TABLE permissions (
      user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      permission TEXT NOT NULL CHECK (
        permission IN ('tiles:write', 'boardings:write', 'users:manage', 'members:manage')
      ),
      granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      granted_by TEXT,
      PRIMARY KEY (user_id, permission)
    );
    INSERT INTO permissions SELECT * FROM permissions_old;
    DROP TABLE permissions_old;
    COMMIT;
  `);
}
