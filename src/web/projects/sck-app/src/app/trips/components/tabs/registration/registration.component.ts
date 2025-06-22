/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TRIP_DATA, BUS_ONLY_PRICE_DATA, BUS_AND_PASS_PRICE_DATA, BOARDING_LIST } from '@data';
import { TripsFeatureModule } from '@trips-lib';
import { Price, Tile, TileActions, Trip } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    imports: [CommonModule, TripsFeatureModule],
})
export class RegistrationComponent implements OnInit {
    public tripData: Tile[] = TRIP_DATA;
    public trips: Trip[] = [];

    public busOnlyPrice: Price = BUS_ONLY_PRICE_DATA;
    public busAndPassPrice: Price[] = BUS_AND_PASS_PRICE_DATA;
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
