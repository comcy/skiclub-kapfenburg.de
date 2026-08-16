/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';
import { environment } from 'projects/sck-app/src/environments/environment';
import { BaseTile, Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { TripConfig } from 'projects/trips-lib/src/lib/domain/models/trip-config';

/**
 * Wire shape returned by `GET {sckApiUrl}/tiles`. Mirrors the admin app's editable
 * tile fields (see sck-admin-app/tile-management/domain/tile.ts, the established
 * API contract) plus a few optional fields the admin editor doesn't manage but the
 * backend may still carry through for tiles migrated from the old static data
 * (course/trip registration config). Where those are absent we fall back to sane
 * defaults rather than loosening the shared Tile model.
 */
interface ApiTile {
    id: string;
    order: number;
    type: 'info' | 'event' | 'course';
    title: string;
    date: string;
    subTitle: string;
    image: string;
    imageDescription: string;
    description: string;
    status: 'open' | 'canceled' | 'bookedUp';
    expiration: string;
    behavior: 'view' | 'click';
    boardings?: string[];
    actions?: ('share' | 'register' | 'download')[];
    downloadActionLink?: string;
    avatar?: string;
    visible?: boolean;
    details?: string;
    location?: string;
    timeData?: string[];
    destination?: string;
    additionalInformation?: string;
    tripConfig?: TripConfig;
    course?: GymCourseInformation;
}

interface ApiTilesResponse {
    items: ApiTile[];
    total: number;
}

function toExpirationDate(value: string): Date {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function mapApiTileToTile(api: ApiTile): Tile {
    const base: BaseTile = {
        id: api.id,
        order: api.order,
        title: api.title,
        date: api.date,
        subTitle: api.subTitle,
        image: api.image,
        imageDescription: api.imageDescription,
        description: api.description,
        details: api.details ?? '',
        status: api.status as TileStatus,
        expiration: toExpirationDate(api.expiration),
        behavior: api.behavior as TileBehavior,
        boardings: api.boardings,
        actions: api.actions as TileActions[] | undefined,
        downloadActionLink: api.downloadActionLink,
        avatar: api.avatar,
        visible: api.visible,
    };

    switch (api.type) {
        case 'course':
            return {
                ...base,
                type: TileType.Course,
                location: api.location ?? '',
                course: api.course ?? {
                    name: api.title,
                    description: api.description,
                    details: api.details ?? '',
                    time: '',
                    location: api.location ?? '',
                    contact: '',
                },
            };
        case 'event':
            return {
                ...base,
                type: TileType.Event,
                tripConfig: api.tripConfig ?? { pricing: {} },
                destination: api.destination,
                location: api.location,
                additionalInformation: api.additionalInformation,
            };
        case 'info':
        default:
            return {
                ...base,
                type: TileType.Info,
                location: api.location,
                timeData: api.timeData,
            };
    }
}

/**
 * Runtime replacement for the static `@data` tile imports: fetches tiles from
 * sck-api so edits made in the admin app show up on the public site without a
 * redeploy. Result is cached for the lifetime of the service (page load) since
 * tiles rarely change mid-session and every consumer needs the same list.
 */
@Injectable({
    providedIn: 'root',
})
export class TilesApiService {
    private readonly http = inject(HttpClient);

    private readonly tiles$: Observable<Tile[]> = this.http
        .get<ApiTilesResponse>(`${environment.sckApiUrl}/tiles`, { params: { limit: '1000' } })
        .pipe(
            map((response) => response.items.map(mapApiTileToTile)),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    getTiles(): Observable<Tile[]> {
        return this.tiles$;
    }

    getTile(id: string): Observable<Tile | undefined> {
        return this.getTiles().pipe(map((tiles) => tiles.find((tile) => tile.id === id)));
    }
}
