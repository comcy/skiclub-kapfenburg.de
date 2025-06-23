/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';

@Component({
    selector: 'app-gym',
    templateUrl: './gym.component.html',
    styleUrls: ['./gym.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        MatTabsModule,
        MatToolbarModule,
        CoursesFeatureModule,
        CoursesUiModule,
        SiteHeaderComponent,
    ],
})
export class GymComponent {
    public title = 'Gymnastik';
    public color: MaterialColor = 'primary';
    public navLinks = [
        {
            label: 'Information',
            link: './information',
        },
        {
            label: 'Anmeldung',
            link: './registration',
        },
    ];
}
