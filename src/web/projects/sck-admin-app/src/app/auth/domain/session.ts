// Permissions are multi-valued, not a single read/editor flag: a user can hold any
// combination, e.g. tiles:write without boardings:write, or users:manage on its own.
// New invited users start with none (read-only) and are granted these individually.
export type Permission = 'tiles:write' | 'boardings:write' | 'users:manage' | 'members:manage' | 'sepa:export';

export interface Session {
    email: string;
    isSuperAdmin: boolean;
    permissions: Permission[];
}
