import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-editable-text',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
    template: `
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ label }}</mat-label>
            <input matInput [(ngModel)]="value" (ngModelChange)="onValueChange()" [placeholder]="label" />
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
export class EditableTextComponent {
    @Input() value = '';
    @Input() label = '';
    @Output() valueChange = new EventEmitter<string>();

    onValueChange(): void {
        this.valueChange.emit(this.value);
    }
}
