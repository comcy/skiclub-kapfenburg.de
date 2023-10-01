/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component } from '@angular/core';

@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss'],
})
export class TripsComponent {
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
