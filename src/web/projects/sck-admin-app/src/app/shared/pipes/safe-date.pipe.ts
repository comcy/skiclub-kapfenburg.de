/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

// Tiles, die aus den alten statischen Frontend-Daten importiert wurden
// (siehe Issue #210), haben "date" oft als freien Anzeigetext ("28. Dezember
// 2026", Zeitraeume wie "15. bis 16. Maerz 2027" oder leer bei Info-Tiles)
// statt als ISO-String, wie es admin-erstellte Tiles liefern. Angulars
// DatePipe wirft dafuer NG02100 (InvalidPipeArgumentError) statt den Wert
// einfach durchzureichen - dieser Wrapper faengt das ab und zeigt den
// Rohwert, wenn er kein echtes Datum ist.
@Pipe({ name: 'safeDate', standalone: true })
export class SafeDatePipe implements PipeTransform {
    private readonly datePipe = new DatePipe('de-DE');

    transform(value: string | null | undefined, format = 'shortDate'): string {
        if (!value) return '–';
        try {
            return this.datePipe.transform(value, format) ?? value;
        } catch {
            return value;
        }
    }
}
