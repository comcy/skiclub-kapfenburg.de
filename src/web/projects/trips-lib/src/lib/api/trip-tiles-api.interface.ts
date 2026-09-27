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
    // Static Ausfahrten (TRIP_DATA) plus whatever's been added via the
    // admin app's database - additive, never a replacement. Must resolve
    // even if sck-api is unreachable (falls back to TRIP_DATA alone).
    public abstract getAllTrips(): Observable<Tile[]>;
}
