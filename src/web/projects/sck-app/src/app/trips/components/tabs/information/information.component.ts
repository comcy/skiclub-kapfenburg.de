/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TripsFeatureModule],
})
export class InformationComponent {}
