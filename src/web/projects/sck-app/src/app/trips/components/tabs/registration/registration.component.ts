/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';
import { EventTile, TileActions, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Trip } from 'projects/trips-lib/src/lib/domain/models';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    imports: [TripsFeatureModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
})
export class RegistrationComponent implements OnInit {
    public trips: Trip[] = [];

    private tripsApi = inject(TripTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.tripsApi.getAllTrips().subscribe((tiles) => {
            const events = tiles.filter((t): t is EventTile => t.type === TileType.Event);

            for (const t of events) {
                if (t.actions?.includes(TileActions.Register)) {
                    this.trips.push({
                        id: t.id,
                        destination: t.destination || t.title,
                        date: t.date,
                        availableBoardings: t.boardings as string[],
                        tripConfig: t.tripConfig,
                    });
                }
            }
            this.cdr.markForCheck();
        });
    }
}
