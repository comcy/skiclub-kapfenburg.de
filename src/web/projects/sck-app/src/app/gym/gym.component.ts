/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GymFeatureModule } from '@gym-lib';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';

// Single consolidated page - no tabs, see GymGeneralInformationComponent for content.
@Component({
    selector: 'app-gym',
    templateUrl: './gym.component.html',
    styleUrls: ['./gym.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [GymFeatureModule, SiteHeaderComponent],
})
export class GymComponent {
    public title = 'Gymnastik';
    public color: MaterialColor = 'primary';
}
