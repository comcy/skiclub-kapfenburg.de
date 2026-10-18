/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';

interface SettingRow {
  value: string;
}

// Generic key-value get/set - values are stored as JSON strings, callers
// parse/stringify their own shape (see NOTIFICATION_BCC_SETTING_KEY).
export const getSetting = <T>(key: string): T | undefined => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as SettingRow | undefined;
  return row ? (JSON.parse(row.value) as T) : undefined;
};

export const setSetting = <T>(key: string, value: T): void => {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
  ).run(key, JSON.stringify(value));
};
