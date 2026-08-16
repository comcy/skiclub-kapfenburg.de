/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Granular rights beyond plain read/write. Baseline read is implicit for any
// authenticated user; everything here is an elevated grant an admin hands
// out one at a time.
export const PERMISSIONS = ['tiles:write', 'boardings:write', 'users:manage', 'sepa:read'] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const isPermission = (value: string): value is Permission => (PERMISSIONS as readonly string[]).includes(value);

export interface AuthUser {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: Permission[];
}

export interface MagicLinkRequestBody {
  email?: string;
}

export interface MagicLinkVerifyBody {
  token?: string;
}

export interface CreateInviteBody {
  email?: string;
}

export interface AcceptInviteBody {
  token?: string;
}

export interface UpdatePermissionsBody {
  permissions?: string[];
}
