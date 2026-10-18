import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { BoardingsDataService } from '../../boardings-management/services/boardings-data.service';
import { TileStatus } from '../../tile-management/domain/tile-enums';
import { TilesDataService } from '../../tile-management/services/tiles-data.service';
import { UsersDataService } from '../../user-management/services/users-data.service';
import { ActivityEntry, DashboardStats } from '../domain/dashboard';

const isInviteExpired = (expiresAt: string): boolean => new Date(expiresAt).getTime() < Date.now();

@Injectable({
    providedIn: 'root',
})
export class DashboardDataService {
    private readonly tilesData = inject(TilesDataService);
    private readonly boardingsData = inject(BoardingsDataService);
    private readonly usersData = inject(UsersDataService);

    load(): Observable<{ stats: DashboardStats; activity: ActivityEntry[] }> {
        return forkJoin({
            tiles: this.tilesData.getTiles(1, 1000, undefined, undefined, undefined, 'event'),
            boardings: this.boardingsData.getBoardings(1, 1),
            users: this.usersData.getUsers(),
            invites: this.usersData.getInvites(),
        }).pipe(
            map(({ tiles, boardings, users, invites }) => {
                const pendingInvites = invites.filter((i) => !i.acceptedAt && !isInviteExpired(i.expiresAt));

                const stats: DashboardStats = {
                    tilesTotal: tiles.total,
                    tilesOpen: tiles.items.filter((t) => t.status === TileStatus.Open).length,
                    tilesCanceled: tiles.items.filter((t) => t.status === TileStatus.Canceled).length,
                    tilesBookedUp: tiles.items.filter((t) => t.status === TileStatus.BookedUp).length,
                    boardingsTotal: boardings.total,
                    usersTotal: users.length,
                    pendingInvites: pendingInvites.length,
                };

                const activity: ActivityEntry[] = [
                    ...tiles.items.map((t): ActivityEntry => ({
                        icon: t.createdAt === t.updatedAt ? 'tile-created' : 'tile-updated',
                        prefix: 'Ausfahrt ',
                        highlight: `„${t.title}"`,
                        suffix: t.createdAt === t.updatedAt ? ' erstellt' : ' aktualisiert',
                        timestamp: t.updatedAt ?? t.createdAt ?? t.date,
                    })),
                    ...invites.map((i): ActivityEntry => ({
                        icon: 'invite',
                        prefix: '',
                        highlight: i.email,
                        suffix: ' eingeladen',
                        timestamp: i.createdAt,
                    })),
                    ...users
                        .filter((u) => !!u.lastLoginAt)
                        .map((u): ActivityEntry => ({
                            icon: 'login',
                            prefix: '',
                            highlight: u.email,
                            suffix: ' angemeldet',
                            timestamp: u.lastLoginAt as string,
                        })),
                ]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 8);

                return { stats, activity };
            }),
        );
    }
}
