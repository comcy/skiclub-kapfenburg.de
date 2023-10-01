/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component } from '@angular/core';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
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
    ];
}
