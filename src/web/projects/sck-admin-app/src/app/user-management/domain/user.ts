import { Permission } from '../../auth/domain/session';

export interface AdminUser {
    id: string;
    email: string;
    isSuperAdmin: boolean;
    permissions: Permission[];
    lastLoginAt: string | null;
}
