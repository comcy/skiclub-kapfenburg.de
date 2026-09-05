import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CourseRegistration, CourseRegistrationCreationParams } from '../../../domain/course-registration';
import { TilesDataService } from '../../../services/tiles-data.service';

@Component({
    selector: 'app-course-registration-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
    ],
    templateUrl: './course-registration-editor.component.html',
    styleUrls: ['./course-registration-editor.component.scss'],
})
export class CourseRegistrationEditorComponent {
    @Input() tileId!: string;
    @Input() registration: CourseRegistration | null = null;
    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public readonly sportTypes = ['Ski Alpin', 'Snowboard'];

    onSave(): void {
        if (!this.registration) return;

        const params: CourseRegistrationCreationParams = {
            firstName: this.registration.firstName,
            lastName: this.registration.lastName,
            email: this.registration.email || undefined,
            phone: this.registration.phone || undefined,
            birthday: this.registration.birthday || undefined,
            sportType: this.registration.sportType || undefined,
            level: this.registration.level || undefined,
            groupId: this.registration.groupId || undefined,
            status: this.registration.status,
            source: this.registration.source,
            notes: this.registration.notes || undefined,
            orderIndex: this.registration.orderIndex,
            paid: this.registration.paid,
            transferredToExternalList: this.registration.transferredToExternalList,
        };

        // Zoneless change detection (see app.config.ts) - without
        // markForCheck() the parent's editor panel wouldn't visibly close.
        if (this.registration.id) {
            this.dataService.updateCourseRegistration(this.registration.id, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        } else {
            this.dataService.createCourseRegistration(this.tileId, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        }
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}
