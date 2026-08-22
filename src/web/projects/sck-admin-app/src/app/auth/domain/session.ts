// Permissions are multi-valued, not a single read/editor flag: a user can hold any
// combination, e.g. tiles:write without boardings:write, or sepa:read on its own.
// New invited users start with none (read-only) and are granted these individually.
export type Permission = 'tiles:write' | 'boardings:write' | 'sepa:read';

export interface Session {
    email: string;
    permissions: Permission[];
}
