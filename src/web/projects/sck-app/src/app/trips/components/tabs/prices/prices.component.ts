/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    imports: [CommonModule, TripsFeatureModule],
})
export class PricesComponent {}
