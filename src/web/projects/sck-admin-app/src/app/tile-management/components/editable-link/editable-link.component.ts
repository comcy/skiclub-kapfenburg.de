import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-editable-link',

    standalone: true,

    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],

    template: `
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ label }}</mat-label>

            <input matInput [(ngModel)]="link" (ngModelChange)="onLinkChange()" [placeholder]="label" />
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
export class EditableLinkComponent {
    @Input() link: string | undefined = '';

    @Input() label = '';

    @Output() linkChange = new EventEmitter<string>();

    onLinkChange(): void {
        this.linkChange.emit(this.link);
    }
}
