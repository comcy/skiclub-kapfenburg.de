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
import { TripAddons, TripPricing } from 'projects/trips-lib/src/lib/domain/models/trip-pricing';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { Observable, catchError, combineLatest, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { formatGermanDate, resolveMediaUrl } from './normalize-admin-tile-fields';

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

// Seit Issue #217 wieder pro Ausfahrt im Tile-Editor gepflegt
// (tile.tripConfig.pricing) - die globale Preismanagement-Einstellung
// bleibt nur noch Fallback fuer Tiles, die selbst noch keine eigene
// Preisangabe haben (z.B. frisch angelegt, Preise noch nicht eingetragen).
// Bus+Lift/Nur-Busfahrt gelten immer; die Zuschlaege nur wenn der Admin
// die Ausfahrt als "mit Kursmoeglichkeit" markiert hat.
function resolveTripPricing(
    ownPricing: TripPricing | undefined,
    globalPricing: TripPricing,
    hasCourseOption: boolean | undefined,
): TripPricing {
    const hasOwnPricing = !!(ownPricing && (ownPricing.busLift || ownPricing.busOnly || ownPricing.addons));
    const base = hasOwnPricing ? ownPricing! : globalPricing;
    // Schneeschuhverleih ist unabhaengig von der Kursmoeglichkeit und nur
    // pro Ausfahrt (eigene Preise) einschaltbar, nie aus dem globalen Fallback.
    const snowshoes = hasOwnPricing ? ownPricing!.addons?.snowshoes : undefined;
    const addons: TripAddons = { ...(hasCourseOption ? base.addons : {}), snowshoes };
    if (!snowshoes) delete addons.snowshoes;
    return {
        busLift: base.busLift,
        busOnly: base.busOnly,
        addons: Object.keys(addons).length ? addons : undefined,
    };
}

function mapApiTileToEventTile(api: ApiEventTile, globalPricing: TripPricing): EventTile {
    return {
        id: api.id,
        order: api.order,
        type: TileType.Event,
        title: api.title,
        date: formatGermanDate(api.date),
        subTitle: api.subTitle,
        image: resolveMediaUrl(api.image),
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
            pricing: resolveTripPricing(api.tripConfig?.pricing, globalPricing, api.tripConfig?.hasCourseOption),
        },
        destination: api.destination,
        additionalInformation: api.additionalInformation,
        capacity: api.capacity,
        confirmedRegistrationsCount: api.confirmedRegistrationsCount,
    };
}

/**
 * Ausfahrten-Events kommen seit Issue #215 ausschliesslich aus der
 * sck-api-DB. TRIP_DATA enthaelt nur noch die zwei Info-Tiles (Skiboerse,
 * Schneeschuhverleih), fuer die es noch keine API-Anbindung gibt - die
 * bleiben additiv dazugemergt. Faellt sck-api aus, zeigt die Seite nur
 * noch diese zwei Info-Tiles, keine Ausfahrten mehr (kein statischer
 * Event-Fallback mehr vorhanden).
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
