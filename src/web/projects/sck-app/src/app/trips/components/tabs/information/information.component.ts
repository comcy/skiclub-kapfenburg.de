/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';

@Component({
    standalone: true,
    selector: 'app-information',
    templateUrl: './information.component.html',
    imports: [CommonModule, TripsFeatureModule],
})
export class InformationComponent {}
