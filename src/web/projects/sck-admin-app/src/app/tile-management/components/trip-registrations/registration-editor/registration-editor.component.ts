import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map } from 'rxjs';
import { Boarding } from '../../../../boardings-management/domain/boarding';
import { BoardingsDataService } from '../../../../boardings-management/services/boardings-data.service';
import {
    RegistrationAgeCategory,
    TripRegistration,
    TripRegistrationCreationParams,
} from '../../../domain/trip-registration';
import { TilesDataService } from '../../../services/tiles-data.service';

@Component({
    selector: 'app-registration-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './registration-editor.component.html',
    styleUrls: ['./registration-editor.component.scss'],
})
export class RegistrationEditorComponent {
    @Input() tileId!: string;
    @Input() registration: TripRegistration | null = null;
    @Output() saved = new EventEmitter<void>();

    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public availableBoardings$: Observable<Boarding[]> = this.boardingsService
        .getBoardings(1, 1000)
        .pipe(map((response) => response.items));

    public readonly ageCategories: RegistrationAgeCategory[] = ['adult', 'youthUntil16', 'childUntil6'];
    public readonly ageCategoryLabels: Record<RegistrationAgeCategory, string> = {
        adult: 'Erwachsen',
        youthUntil16: 'Jugend (bis 16)',
        childUntil6: 'Kind (bis 6)',
    };

    // Read by the dialog's own Speichern button (outside this component, in
    // the dialog shell's sticky actions area).
    get canSave(): boolean {
        return !!this.registration?.firstName && !!this.registration?.lastName;
    }

    onSave(): void {
        if (!this.registration) return;

        const params: TripRegistrationCreationParams = {
            firstName: this.registration.firstName,
            lastName: this.registration.lastName,
            email: this.registration.email || undefined,
            phone: this.registration.phone || undefined,
            boardingId: this.registration.boardingId || undefined,
            ageCategory: this.registration.ageCategory,
            status: this.registration.status,
            source: this.registration.source,
            notes: this.registration.notes || undefined,
            orderIndex: this.registration.orderIndex,
        };

        // Zoneless change detection (see app.config.ts) - without
        // markForCheck() the parent's editor panel wouldn't visibly close.
        if (this.registration.id) {
            this.dataService.updateRegistration(this.registration.id, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        } else {
            this.dataService.createRegistration(this.tileId, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        }
    }
}
