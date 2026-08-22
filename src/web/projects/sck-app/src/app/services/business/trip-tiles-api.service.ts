/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TRIP_DATA } from '@data';
import {
    EventTile,
    Tile,
    TileActions,
    TileBehavior,
    TileStatus,
    TileType,
} from 'projects/shared-lib/src/lib/ui-common/models';
import { TripConfig } from 'projects/trips-lib/src/lib/domain/models/trip-config';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

// Wire shape of one item in GET {sckApiUrl}/tiles?type=event - mirrors the
// admin app's editable EventTile fields (sck-admin-app/tile-management).
interface ApiEventTile {
    id: string;
    order: number;
    type: string;
    title: string;
    date: string;
    subTitle: string;
    image: string;
    imageDescription: string;
    description: string;
    status: string;
    expiration: string;
    behavior: string;
    boardings?: string[];
    actions?: string[];
    downloadActionLink?: string;
    avatar?: string;
    visible?: boolean;
    details?: string;
    location?: string;
    destination?: string;
    additionalInformation?: string;
    tripConfig?: TripConfig;
}

interface ApiTilesResponse {
    items: ApiEventTile[];
    total: number;
}

function toExpirationDate(value: string): Date {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function mapApiTileToEventTile(api: ApiEventTile): EventTile {
    return {
        id: api.id,
        order: api.order,
        type: TileType.Event,
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
        tripConfig: api.tripConfig ?? { pricing: {} },
        destination: api.destination,
        location: api.location,
        additionalInformation: api.additionalInformation,
    };
}

/**
 * Additive: static TRIP_DATA plus whatever Ausfahrten have been added
 * through the admin app's database - never a replacement for TRIP_DATA.
 * Falls back to TRIP_DATA alone if sck-api is unreachable, so a database
 * outage never takes the existing, working trip pages down with it.
 */
@Injectable()
export class TripTilesApiService implements TripTilesApiServiceInterface {
    private readonly http = inject(HttpClient);

    private readonly trips$: Observable<Tile[]> = this.http
        .get<ApiTilesResponse>(`${environment.sckApiUrl}/tiles`, { params: { type: 'event', limit: '1000' } })
        .pipe(
            map((response) => [
                ...TRIP_DATA,
                ...response.items.filter((item) => item.type === 'event').map(mapApiTileToEventTile),
            ]),
            catchError(() => of(TRIP_DATA)),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    getAllTrips(): Observable<Tile[]> {
        return this.trips$;
    }
}

export const tripTilesApiServiceProvider = {
    provide: TripTilesApiServiceInterface,
    useClass: TripTilesApiService,
};
