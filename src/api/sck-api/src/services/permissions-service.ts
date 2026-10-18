/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';
import { Permission } from '../domain/auth.js';

export const getPermissionsForUser = (userId: string): Permission[] => {
  const rows = db.prepare('SELECT permission FROM permissions WHERE user_id = ?').all(userId) as {
    permission: Permission;
  }[];
  return rows.map((r) => r.permission);
};

// Full replace of a user's granted permissions — mirrors the PUT semantics
// of the rest of this API.
export const setPermissionsForUser = (userId: string, permissions: Permission[], grantedBy: string): void => {
  db.prepare('DELETE FROM permissions WHERE user_id = ?').run(userId);
  const insert = db.prepare('INSERT INTO permissions (user_id, permission, granted_by) VALUES (?, ?, ?)');
  for (const permission of new Set(permissions)) {
    insert.run(userId, permission, grantedBy);
  }
};
