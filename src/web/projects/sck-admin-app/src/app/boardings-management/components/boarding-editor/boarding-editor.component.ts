import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Boarding, BoardingCreationParams } from '../../domain/boarding';
import { BoardingsDataService } from '../../services/boardings-data.service';

@Component({
    selector: 'app-boarding-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
        <div *ngIf="boarding">
            <h3>{{ boarding.id ? 'Edit Boarding' : 'Create Boarding' }}</h3>

            <mat-form-field appearance="outline" class="full-width">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="boarding.name" placeholder="E.g. Westhausen Turnhalle (5:15 Uhr)" />
            </mat-form-field>

            <div class="actions">
                <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!boarding.name">Save</button>
                <button mat-button (click)="onCancel()">Cancel</button>
            </div>
        </div>
    `,
    styles: [
        `
            .full-width {
                width: 100%;
            }
            .actions {
                display: flex;
                gap: 8px;
                margin-top: 16px;
            }
        `,
    ],
})
export class BoardingEditorComponent {
    @Input() boarding: Boarding | null = null;
    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly dataService = inject(BoardingsDataService);

    onSave(): void {
        if (!this.boarding) return;

        const params: BoardingCreationParams = { name: this.boarding.name };

        if (this.boarding.id) {
            this.dataService.updateBoarding(this.boarding.id, params).subscribe(() => this.saved.emit());
        } else {
            this.dataService.createBoarding(params).subscribe(() => this.saved.emit());
        }
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}
