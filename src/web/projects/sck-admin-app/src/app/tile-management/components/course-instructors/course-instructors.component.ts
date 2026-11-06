import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseInstructor } from '../../domain/course-instructor';
import { TeachingTeamEntry } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';

// Übungsleiter-Auswahl eines Kurses (Mehrfachauswahl aus dem Lehrteam). Speichert sofort; der Elternteil hält die
// komplette Liste aller Kurse der Kachel und bekommt sie nach jedem Speichern aktualisiert zurück.
@Component({
    selector: 'app-course-instructors',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule],
    template: `
        <div class="instructors">
            <span class="label">Übungsleiter:</span>
            @if (canEdit) {
                <mat-form-field class="no-print" subscriptSizing="dynamic" appearance="outline">
                    <mat-select
                        multiple
                        [value]="selectedIds"
                        placeholder="Lehrteam wählen"
                        aria-label="Übungsleiter"
                        (selectionChange)="onChange($event.value)"
                    >
                        @for (m of team; track m.id) {
                            <mat-option [value]="m.id">{{ m.firstName }} {{ m.lastName }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>
                <span class="print-only">{{ names || '–' }}</span>
            } @else {
                <span>{{ names || '–' }}</span>
            }
        </div>
    `,
    styles: `
        .instructors {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin: 8px 0;
        }
        .label {
            font-weight: 500;
        }
        mat-form-field {
            min-width: 240px;
        }
        .print-only {
            display: none;
        }
        @media print {
            .print-only {
                display: inline;
            }
        }
    `,
})
export class CourseInstructorsComponent {
    private readonly dataService = inject(TilesDataService);
    private readonly snackBar = inject(MatSnackBar);

    @Input({ required: true }) tileId!: string;
    @Input() sport = '';
    @Input() level = '';
    @Input() team: TeachingTeamEntry[] = [];
    @Input() assignments: CourseInstructor[] = [];
    @Input() canEdit = false;
    @Output() assignmentsChange = new EventEmitter<CourseInstructor[]>();

    private get own(): CourseInstructor[] {
        return this.assignments.filter((a) => a.sportType === this.sport && a.level === this.level);
    }

    get selectedIds(): string[] {
        return this.own.map((a) => a.memberId);
    }

    get names(): string {
        return this.own.map((a) => `${a.firstName} ${a.lastName}`).join(', ');
    }

    onChange(memberIds: string[]): void {
        this.dataService.setCourseInstructors(this.tileId, this.sport, this.level, memberIds).subscribe({
            next: (all) => this.assignmentsChange.emit(all),
            error: (e) =>
                this.snackBar.open(e?.error?.error ?? 'Übungsleiter konnten nicht gespeichert werden.', 'OK', {
                    duration: 6000,
                }),
        });
    }
}
