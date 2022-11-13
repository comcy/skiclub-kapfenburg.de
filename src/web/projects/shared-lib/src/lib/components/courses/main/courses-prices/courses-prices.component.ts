import { Component, OnInit } from '@angular/core';
import { COURSE_AT_HOME_PRICE_DATA, COURSE_ON_TRAVEL_PRICE_DATA } from '@data';
import { Price } from 'projects/shared-lib/src/public-api';

@Component({
  selector: 'lib-courses-prices',
  templateUrl: './courses-prices.component.html',
  styleUrls: ['./courses-prices.component.scss'],
})
export class CoursesPricesComponent implements OnInit {
  public courseAtTravelPrice: Price[] = COURSE_ON_TRAVEL_PRICE_DATA;
  public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;

  constructor() {}

  ngOnInit(): void {}
}
