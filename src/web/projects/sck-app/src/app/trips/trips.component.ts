/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TripsFeatureModule } from '@trips-lib';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss'],
    imports: [CommonModule, RouterModule, MatTabsModule, MatToolbarModule, TripsFeatureModule, SiteHeaderComponent],
})
export class TripsComponent {
    public title = 'Ausfahrten';

    public navLinks = [
        {
            label: 'Anmeldung',
            link: './registration',
        },
        {
            label: 'Information',
            link: './information',
        },
        {
            label: 'Preise',
            link: './prices',
        },
        {
            label: 'Downloads',
            link: './downloads',
        },
    ];
}
