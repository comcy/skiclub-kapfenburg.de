/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TripsFeatureModule } from '@trips-lib';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule, MatTabsModule, MatToolbarModule, TripsFeatureModule, SiteHeaderComponent],
})
export class TripsComponent {
    public title = 'Ausfahrten';

    public navLinks = [
        {
            label: 'Übersicht',
            link: './overview',
        },
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
