import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GERMAN_DATE_FORMATS, GermanDateAdapter, toIsoDate } from 'projects/shared-lib/src/lib/date-time';

@Component({
    selector: 'app-editable-date',

    standalone: true,

    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],

    // Ohne eigenen DateAdapter öffnet der Picker nicht (NG0201); wie im Mitglieder-Editor: deutsches Format.
    providers: [
        { provide: DateAdapter, useClass: GermanDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],

    template: `
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ label }}</mat-label>

            <input
                matInput
                [matDatepicker]="picker"
                [value]="dateValue"
                (dateChange)="dateValue = $event.value"
                [placeholder]="label"
            />

            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>

            <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
    `,

    styles: [
        `
            .full-width {
                width: 100%;
            }
        `,
    ],
})
export class EditableDateComponent {
    @Input() label = '';
    @Input() value: string | null = null;
    // true: nur Kalendertag (yyyy-mm-dd, lokal) statt UTC-Zeitstempel - sonst rutscht das Datum in UTC auf den Vortag.
    @Input() dateOnly = false;
    @Output() valueChange = new EventEmitter<string>();

    // Stabile Date-Instanz je Wert (ein Getter mit new Date() würde bei jedem Change-Detection-Lauf ein neues Objekt liefern).
    private cachedFor: string | null = null;
    private cachedDate: Date | null = null;

    get dateValue(): Date | null {
        if (this.value !== this.cachedFor) {
            this.cachedFor = this.value;
            const d = this.value ? new Date(this.value) : null;
            this.cachedDate = d && !isNaN(d.getTime()) ? d : null;
        }
        return this.cachedDate;
    }

    set dateValue(date: Date | null) {
        if (date) {
            const out = this.dateOnly ? (toIsoDate(date) as string) : date.toISOString();
            this.value = out;
            this.valueChange.emit(out);
        }
    }
}
