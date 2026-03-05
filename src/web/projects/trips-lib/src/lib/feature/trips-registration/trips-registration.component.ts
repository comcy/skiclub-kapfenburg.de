/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit } from '@angular/core';
import { TRIP_DATA } from '@data';
import { TileActions, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../domain/models';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';

@Component({
    selector: 'lib-trips-registration',
    templateUrl: './trips-registration.component.html',
    styleUrls: ['./trips-registration.component.scss'],
    standalone: true,
    imports: [TripsRegistrationFormComponent],
})
export class TripsRegistrationComponent implements OnInit {
    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    public trips: Trip[] = [];

    ngOnInit(): void {
        const events = TRIP_DATA.filter((t) => t.type === TileType.Event);

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
    }
}
