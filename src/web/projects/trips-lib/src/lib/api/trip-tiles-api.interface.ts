/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Tile } from 'projects/shared-lib/src/lib/ui-common/models';
import { Observable } from 'rxjs';

// Same DI-token pattern as TripRegistrationFormServiceInterface: the
// interface lives here (in trips-lib, alongside the components that need
// it), the concrete HTTP-calling implementation lives in sck-app (only an
// app has an environment.ts to read sckApiUrl from) and is wired up via a
// provider in app.module.ts.
@Injectable()
export abstract class TripTilesApiServiceInterface {
    // Ausfahrten-Events kommen seit Issue #215 ausschliesslich aus der
    // sck-api-DB, additiv gemergt mit den zwei statischen Info-Tiles
    // (Skiboerse, Schneeschuhverleih), fuer die es noch keine API-Anbindung
    // gibt. Muss auch bei nicht erreichbarem sck-api resolven (dann nur
    // noch die zwei Info-Tiles, siehe trip-tiles-api.service.ts).
    public abstract getAllTrips(): Observable<Tile[]>;
}
