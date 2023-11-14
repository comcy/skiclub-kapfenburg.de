/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit } from '@angular/core';
import { BOARDING_LIST, TRIP_DATA } from '@data';
import { Tile, TileActions } from 'projects/shared-lib/src/lib/ui-common/models';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../domain/models';

@Component({
    selector: 'lib-trips-registration',
    templateUrl: './trips-registration.component.html',
    styleUrls: ['./trips-registration.component.scss'],
})
export class TripsRegistrationComponent implements OnInit {
    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    public tripData: Tile[] = TRIP_DATA;
    public trips: Trip[] = [];
    public boardings: string[] = BOARDING_LIST;

    ngOnInit(): void {
        for (const t of this.tripData) {
            if (t.actions?.includes(TileActions.Register)) {
                this.trips.push({
                    destination: t.title,
                    date: t.date,
                    boarding: t.boardings as string[],
                });
            }
        }
    }
}
