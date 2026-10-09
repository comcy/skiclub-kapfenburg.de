import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-editable-date',

    standalone: true,

    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],

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
    @Output() valueChange = new EventEmitter<string>();

    get dateValue(): Date | null {
        return this.value ? new Date(this.value) : null;
    }

    set dateValue(date: Date | null) {
        if (date) {
            const iso = date.toISOString();
            this.value = iso;
            this.valueChange.emit(iso);
        }
    }
}
