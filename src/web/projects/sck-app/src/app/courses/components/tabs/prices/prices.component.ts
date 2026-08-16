/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CoursesFeatureModule, CoursesUiModule],
})
export class PricesComponent {}
