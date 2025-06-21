/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GymFeatureModule } from '@gym-lib';
import { SiteHeaderComponent } from '@shared/ui-common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-gym',
    templateUrl: './gym.component.html',
    styleUrls: ['./gym.component.scss'],
    imports: [CommonModule, RouterModule, MatToolbarModule, GymFeatureModule, SiteHeaderComponent],
})
export class GymComponent {
    public title = 'Gymnastik';
}
