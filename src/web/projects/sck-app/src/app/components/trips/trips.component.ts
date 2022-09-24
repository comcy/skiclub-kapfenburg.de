import { Component, OnInit } from '@angular/core';
import { Price, Tile, TileActions } from 'projects/shared-lib/src/lib/models';
import { Trip } from 'projects/shared-lib/src/lib/models/trip';
import {
  BUS_ONLY_PRICE_DATA,
  COURSE_AT_HOME_PRICE_DATA,
  COURSE_ON_TRAVEL_PRICE_DATA,
} from '../../price-data';
import { TRIP_DATA } from '../../trip-data';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  public tripData: Tile[] = TRIP_DATA;
  public trips: Trip[] = [];

  public busOnlyPrice: Price = BUS_ONLY_PRICE_DATA;
  public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;

  constructor() {}

  ngOnInit(): void {
    for (let t of this.tripData) {
      if (t.actions?.includes(TileActions.Register))
        this.trips.push({ destination: t.title, date: t.date });
    }
  }

  public onTripRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
    }
  }
}
