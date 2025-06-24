/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GymFeatureModule } from '@gym-lib';
import { GymInformationCoreServiceInterface } from 'projects/gym-lib/src/lib/domain';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    imports: [CommonModule, RouterModule, GymFeatureModule],
    standalone: true,
})
export class InformationComponent {
    public gymInformationCoreService = inject(GymInformationCoreServiceInterface);
}
