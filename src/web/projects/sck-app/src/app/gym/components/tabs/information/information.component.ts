/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GymFeatureModule } from '@gym-lib';
import { GymInformationCoreServiceInterface } from 'projects/gym-lib/src/lib/domain';
import { Appointment } from 'projects/shared-lib/src/lib/components/calendar/calendar-appointment';
import { CalendarComponent } from 'projects/shared-lib/src/lib/components/calendar/calendar.component';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    imports: [CommonModule, RouterModule, GymFeatureModule, CalendarComponent],
    standalone: true,
})
export class InformationComponent {
    public gymInformationCoreService = inject(GymInformationCoreServiceInterface);

    public appointments: Appointment[] = [
        {
            tag: 'Montag',
            zeitblock: 'nachmittag',
            titel: 'Fitnessmix',
            uhrzeit: '19:00 - 20:00',
            ort: 'Altes Schulhaus Hülen)',
        },
        {
            tag: 'Montag',
            zeitblock: 'nachmittag',
            titel: 'Vitalgymnastik 50 Plus',
            uhrzeit: '20:00 - 21:00',
            ort: 'Altes Schulhaus Hülen',
        },
        {
            tag: 'Montag',
            zeitblock: 'nachmittag',
            titel: 'Fitness Cocktail',
            uhrzeit: '19:00 - 20:00',
            ort: 'Schulturnhalle Lauchheim',
        },
        {
            tag: 'Mittwoch',
            zeitblock: 'vormittag',
            titel: 'Pilates',
            uhrzeit: '08:30 - 09:30',
            ort: 'Altes Schulhaus Hülen',
        },
        // ...
    ];
}
