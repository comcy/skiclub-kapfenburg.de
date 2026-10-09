/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';

@Component({
    selector: 'app-trip-detail',
    templateUrl: './trip-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TripsFeatureModule],
})
export class TripDetailComponent {}
