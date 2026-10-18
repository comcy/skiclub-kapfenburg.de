/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { BOARDING_LIST, BUS_AND_PASS_PRICE_DATA, BUS_ONLY_PRICE_DATA } from '@data';
import { BaseTile, Price, TileActions } from 'projects/shared-lib/src/lib/ui-common/models';
import { TripTilesApiServiceInterface } from '../../api/trip-tiles-api.interface';
import { Trip } from '../../domain/models/trip-base';

@Component({
    selector: 'lib-trips-prices',
    templateUrl: './trips-prices.component.html',
    styleUrls: ['./trips-prices.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class TripsPricesComponent implements OnInit {
    public tripData: BaseTile[] = [];
    public trips: Trip[] = [];

    public busOnlyPrice: Price = BUS_ONLY_PRICE_DATA;
    public busAndPassPrice: Price[] = BUS_AND_PASS_PRICE_DATA;
    public boardings: string[] = BOARDING_LIST;

    private tripsApi = inject(TripTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.tripsApi.getAllTrips().subscribe((tripData) => {
            this.tripData = tripData;
            for (const t of tripData) {
                if (t.actions?.includes(TileActions.Register)) {
                    this.trips.push({
                        destination: t.title,
                        date: t.date,
                        availableBoardings: t.boardings as string[],
                    });
                }
            }
            this.cdr.markForCheck();
        });
    }
}
