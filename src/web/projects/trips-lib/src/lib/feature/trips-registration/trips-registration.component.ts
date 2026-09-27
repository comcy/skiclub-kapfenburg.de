/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ChangeDetectorRef, Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { EventTile, TileActions, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { BehaviorSubject } from 'rxjs';
import { TripTilesApiServiceInterface } from '../../api/trip-tiles-api.interface';
import { Trip } from '../../domain/models';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';

@Component({
    selector: 'lib-trips-registration',
    templateUrl: './trips-registration.component.html',
    styleUrls: ['./trips-registration.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TripsRegistrationFormComponent],
})
export class TripsRegistrationComponent implements OnInit {
    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    public trips: Trip[] = [];

    private tripsApi = inject(TripTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.tripsApi.getAllTrips().subscribe((tiles) => {
            const events = tiles.filter((t): t is EventTile => t.type === TileType.Event);

            for (const t of events) {
                if (t.actions?.includes(TileActions.Register)) {
                    this.trips.push({
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
