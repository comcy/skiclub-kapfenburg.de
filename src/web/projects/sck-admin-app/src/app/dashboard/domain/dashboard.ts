export interface DashboardStats {
    tilesTotal: number;
    tilesOpen: number;
    tilesCanceled: number;
    tilesBookedUp: number;
    boardingsTotal: number;
    usersTotal: number;
    pendingInvites: number;
}

export type ActivityIcon = 'tile-created' | 'tile-updated' | 'invite' | 'login';

export interface ActivityEntry {
    icon: ActivityIcon;
    prefix: string;
    highlight: string;
    suffix: string;
    timestamp: string;
}
