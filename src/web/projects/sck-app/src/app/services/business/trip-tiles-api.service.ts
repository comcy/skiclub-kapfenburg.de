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
import { TripPricing } from 'projects/trips-lib/src/lib/domain/models/trip-pricing';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { Observable, catchError, combineLatest, map, of, shareReplay } from 'rxjs';
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
    capacity?: number;
    confirmedRegistrationsCount?: number;
}

interface ApiTilesResponse {
    items: ApiEventTile[];
    total: number;
}

function toExpirationDate(value: string): Date {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Bus+Lift and Bus-only apply to every trip; the course/technik/snowshoe
// addons only get merged in when the admin marked the trip "Ausfahrt mit
// Kursmöglichkeit" (tripConfig.hasCourseOption) - see Einstellungen →
// Preismanagement, the single global source these prices now come from
// (no more per-tile manual entry, see tile-editor.component.ts).
function resolveTripPricing(globalPricing: TripPricing, hasCourseOption: boolean | undefined): TripPricing {
    return {
        busLift: globalPricing.busLift,
        busOnly: globalPricing.busOnly,
        addons: hasCourseOption ? globalPricing.addons : undefined,
    };
}

function mapApiTileToEventTile(api: ApiEventTile, globalPricing: TripPricing): EventTile {
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
        tripConfig: {
            ...api.tripConfig,
            pricing: resolveTripPricing(globalPricing, api.tripConfig?.hasCourseOption),
        },
        destination: api.destination,
        location: api.location,
        additionalInformation: api.additionalInformation,
        capacity: api.capacity,
        confirmedRegistrationsCount: api.confirmedRegistrationsCount,
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

    private readonly tripPricing$: Observable<TripPricing> = this.http
        .get<TripPricing>(`${environment.sckApiUrl}/settings/trip-pricing`)
        .pipe(catchError(() => of({})));

    private readonly trips$: Observable<Tile[]> = combineLatest([
        this.http
            .get<ApiTilesResponse>(`${environment.sckApiUrl}/tiles`, { params: { type: 'event', limit: '1000' } })
            .pipe(map((response) => response.items.filter((item) => item.type === 'event'))),
        this.tripPricing$,
    ]).pipe(
        map(([items, globalPricing]) => [
            ...TRIP_DATA,
            ...items.map((item) => mapApiTileToEventTile(item, globalPricing)),
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
