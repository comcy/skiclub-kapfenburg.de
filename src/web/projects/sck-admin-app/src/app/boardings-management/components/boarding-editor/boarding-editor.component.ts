import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Boarding, BoardingCreationParams } from '../../domain/boarding';
import { BoardingsDataService } from '../../services/boardings-data.service';

@Component({
    selector: 'app-boarding-editor',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
        @if (boarding) {
            <div class="editor-form">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Name</mat-label>
                    <input matInput [(ngModel)]="boarding.name" placeholder="E.g. Westhausen Turnhalle (5:15 Uhr)" />
                </mat-form-field>
            </div>
        }
    `,
    styles: [
        `
            .editor-form {
                // Material zeroes mat-dialog-content's padding-top right
                // after mat-dialog-title (see member-editor.component.scss's
                // identical rule), which otherwise clips an outline field's
                // floated label at the very top.
                padding-top: 8px;
            }
            .full-width {
                width: 100%;
            }
        `,
    ],
})
export class BoardingEditorComponent {
    @Input() boarding: Boarding | null = null;
    @Output() saved = new EventEmitter<void>();

    private readonly dataService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    // Read by the dialog's own Speichern button (outside this component, in
    // the dialog shell's sticky actions area).
    get canSave(): boolean {
        return !!this.boarding?.name;
    }

    // Zoneless change detection (see app.config.ts) doesn't track a plain
    // HttpClient subscribe callback - without markForCheck() the parent's
    // @if (selectedBoarding) editor panel wouldn't visibly close on save.
    onSave(): void {
        if (!this.boarding) return;

        const params: BoardingCreationParams = { name: this.boarding.name };

        if (this.boarding.id) {
            this.dataService.updateBoarding(this.boarding.id, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        } else {
            this.dataService.createBoarding(params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        }
    }
}
