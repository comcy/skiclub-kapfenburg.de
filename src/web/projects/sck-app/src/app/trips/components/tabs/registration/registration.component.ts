/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TRIP_DATA } from '@data';
import { TripsFeatureModule } from '@trips-lib';
import { TileActions, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Trip } from 'projects/trips-lib/src/lib/domain/models';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    imports: [CommonModule, TripsFeatureModule],
    standalone: true,
})
export class RegistrationComponent implements OnInit {
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
