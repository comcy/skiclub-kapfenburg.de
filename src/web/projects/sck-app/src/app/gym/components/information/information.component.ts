/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GymFeatureModule } from '@gym-lib';
import { GymInformationCoreServiceInterface } from 'projects/gym-lib/src/lib/domain';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    imports: [CommonModule, RouterModule, GymFeatureModule],
})
export class InformationComponent {
    constructor(public gymInformationCoreService: GymInformationCoreServiceInterface) {}
}
