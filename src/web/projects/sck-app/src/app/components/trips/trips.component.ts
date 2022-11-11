import { Component, OnInit } from '@angular/core';
import { Price, Tile, TileActions } from 'projects/shared-lib/src/lib/models';
import { Trip } from 'projects/shared-lib/src/lib/models/trip';
import { BUS_AND_PASS_PRICE_DATA, BUS_ONLY_PRICE_DATA } from '../../price-data';
import { BOARDING_LIST, TRIP_DATA } from '../../trip-data';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  public tripData: Tile[] = TRIP_DATA;
  public trips: Trip[] = [];

  public busOnlyPrice: Price = BUS_ONLY_PRICE_DATA;
  public busAndPassPrice: Price[] = BUS_AND_PASS_PRICE_DATA;
  public boardings: string[] = BOARDING_LIST;

  constructor() {}

  ngOnInit(): void {
    for (let t of this.tripData) {
      if (t.actions?.includes(TileActions.Register))
        this.trips.push({ destination: t.title, date: t.date });
    }
  }
}
