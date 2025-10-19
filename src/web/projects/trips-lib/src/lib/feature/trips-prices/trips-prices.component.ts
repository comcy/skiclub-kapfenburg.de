/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, OnInit } from '@angular/core';
import { BOARDING_LIST, BUS_AND_PASS_PRICE_DATA, BUS_ONLY_PRICE_DATA, TRIP_DATA } from '@data';
import { Price, Tile, TileActions, Trip } from 'projects/shared-lib/src/lib/ui-common/models';
import { NgFor } from '@angular/common';

@Component({
    selector: 'lib-trips-prices',
    templateUrl: './trips-prices.component.html',
    styleUrls: ['./trips-prices.component.scss'],
    imports: [NgFor],
})
export class TripsPricesComponent implements OnInit {
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
