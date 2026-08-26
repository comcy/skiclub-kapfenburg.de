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
    source TEXT NOT NULL CHECK (source IN ('online', 'manual', 'paper', 'imported')) DEFAULT 'manual',
    -- registrationId from registrations.ndjson, if this member was promoted
    -- from an online Mitgliedsantrag -- not a DB FK, that log lives on disk.
    application_registration_id TEXT,
    notes TEXT,
    member_since TEXT,
    -- Legacy membership number ("Nr") from the JSON importer - the primary
    -- match key for re-running an import without creating duplicates.
    external_id TEXT,
    mobile TEXT,
    -- AES-256-GCM ciphertext via crypto-service.ts's encryptField(), same
    -- format/key ("iv:authTag:ciphertext" hex, SEPA_ENCRYPTION_KEY) as the
    -- existing public membership application's sepa-data.ndjson - never a
    -- plain column, decrypted on read behind members:manage.
    iban_encrypted TEXT,
    bic TEXT,
    bank_name TEXT,
    account_holder TEXT,
    payment_method TEXT,
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

  CREATE TABLE IF NOT EXISTS newsletter_signups (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
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

  -- Double-opt-in for membership registrations (see membership-confirmation-service.ts).
  -- registration_id points at the NDJSON row (membership-registration.ndjson), not a
  -- SQL row - that data stays append-only, this table only tracks confirmation state.
  CREATE TABLE IF NOT EXISTS membership_confirmation_tokens (
    token_hash TEXT PRIMARY KEY,
    registration_id TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    expires_at TEXT NOT NULL,
    confirmed_at TEXT
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

// members.source's CHECK constraint needs 'imported' too - SQLite can't
// ALTER a CHECK, so an already-existing table needs the same
// rename/rebuild/copy/drop rebuild as the permissions migration above.
// Runs BEFORE the guarded column-ADDs below, and its CREATE TABLE matches
// the table's PRE-Runde-A column list exactly (nothing added yet) - `SELECT
// *` copies by position, so old/new column counts and order must match
// exactly, which only holds if this rebuild happens before any new columns
// exist on either side.
const membersTableSql = (
  db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'members'").get() as
    | { sql: string }
    | undefined
)?.sql;
if (membersTableSql && !membersTableSql.includes("'imported'")) {
  db.exec(`
    BEGIN;
    ALTER TABLE members RENAME TO members_old;
    CREATE TABLE members (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT COLLATE NOCASE,
      phone TEXT,
      birthday TEXT,
      address TEXT,
      is_family_membership INTEGER NOT NULL DEFAULT 0,
      family_group_id TEXT,
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
      source TEXT NOT NULL CHECK (source IN ('online', 'manual', 'paper', 'imported')) DEFAULT 'manual',
      application_registration_id TEXT,
      notes TEXT,
      member_since TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    INSERT INTO members SELECT * FROM members_old;
    DROP TABLE members_old;
    COMMIT;
  `);
}

// Members: JSON-importer columns (Runde A) - plain nullable columns, no
// CHECK involved, so a guarded ALTER TABLE is enough (same pattern as the
// tiles capacity/organizer_user_id migration above). Runs after the rebuild
// above so it always appends onto a table with the pre-Runde-A column
// layout, regardless of whether that table was just rebuilt or already had
// 'imported' in its CHECK from a previous run.
const memberColumns = db.prepare("SELECT name FROM pragma_table_info('members')").all() as { name: string }[];
for (const [column, ddl] of [
  ['external_id', 'external_id TEXT'],
  ['mobile', 'mobile TEXT'],
  ['iban_encrypted', 'iban_encrypted TEXT'],
  ['bic', 'bic TEXT'],
  ['bank_name', 'bank_name TEXT'],
  ['account_holder', 'account_holder TEXT'],
  ['payment_method', 'payment_method TEXT'],
] as const) {
  if (!memberColumns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE members ADD COLUMN ${ddl};`);
  }
}
