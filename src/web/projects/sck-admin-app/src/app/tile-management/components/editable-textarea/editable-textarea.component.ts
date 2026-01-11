import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-editable-textarea',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
    template: `
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ label }}</mat-label>
            <textarea
                matInput
                [(ngModel)]="value"
                (ngModelChange)="onValueChange()"
                [placeholder]="label"
                rows="4"
            ></textarea>
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
export class EditableTextareaComponent {
    @Input() value = '';
    @Input() label = '';
    @Output() valueChange = new EventEmitter<string>();

    onValueChange(): void {
        this.valueChange.emit(this.value);
    }
}
