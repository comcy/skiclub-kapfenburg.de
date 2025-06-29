/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { Appointment } from './calendar-appointment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'shared-lib-calendar',
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true,
})
export class CalendarComponent {
    @Input() termine: Appointment[] = [];

    tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

    getTermineGruppiert(tag: string, zeitblock: 'vormittag' | 'nachmittag') {
        const gruppiert: { [uhrzeit: string]: Appointment[] } = {};

        this.termine
            .filter((t) => t.tag === tag && t.zeitblock === zeitblock)
            .forEach((t) => {
                if (!gruppiert[t.uhrzeit]) {
                    gruppiert[t.uhrzeit] = [];
                }
                gruppiert[t.uhrzeit].push(t);
            });

        return Object.entries(gruppiert).sort((a, b) => a[0].localeCompare(b[0])); // sortiert nach Uhrzeit
    }

    istLeer(tag: string): boolean {
        return !this.termine.some((t) => t.tag === tag);
    }

    getTermine(tag: string, zeitblock: 'vormittag' | 'nachmittag') {
        return this.termine
            .filter((termin) => termin.tag === tag && termin.zeitblock === zeitblock)
            .sort((a, b) => a.uhrzeit.localeCompare(b.uhrzeit));
    }

    getPositionProzent(uhrzeit: string, block: 'vormittag' | 'nachmittag'): number {
        const [stundenStr, minutenStr] = uhrzeit.split(':');
        const stunde = parseInt(stundenStr, 10);
        const minuten = parseInt(minutenStr, 10);
        const gesamtMinuten = stunde * 60 + minuten;

        let start = 0,
            ende = 0;

        if (block === 'vormittag') {
            start = 8 * 60; // 08:00
            ende = 12 * 60; // 12:00
        } else {
            start = 13 * 60; // 13:00
            ende = 18 * 60; // 18:00
        }

        const position = ((gesamtMinuten - start) / (ende - start)) * 100;
        return Math.max(0, Math.min(position, 100)); // clamp
    }
}
