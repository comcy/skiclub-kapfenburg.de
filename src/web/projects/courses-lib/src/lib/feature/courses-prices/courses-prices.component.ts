/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component } from '@angular/core';
import { COURSE_AT_HOME_PRICE_DATA, COURSE_ON_TRAVEL_PRICE_DATA } from '@data';
import { Price } from '../../domain/models';

@Component({
    selector: 'lib-courses-prices',
    templateUrl: './courses-prices.component.html',
    styleUrls: ['./courses-prices.component.scss'],
})
export class CoursesPricesComponent {
    public courseAtTravelPrice: Price[] = COURSE_ON_TRAVEL_PRICE_DATA;
    public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;
}
