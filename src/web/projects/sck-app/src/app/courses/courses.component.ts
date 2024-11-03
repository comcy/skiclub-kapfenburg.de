/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
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
export class CoursesComponent {
    public title = 'Ski- und Snowboardschule';
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
        {
            label: 'Preise',
            link: './prices',
        },
    ];
}
