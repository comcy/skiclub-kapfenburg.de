/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    imports: [CommonModule, CoursesFeatureModule, CoursesUiModule],
})
export class PricesComponent {}
