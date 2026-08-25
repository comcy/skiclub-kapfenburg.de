import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CourseRegistration } from '../../domain/course-registration';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';
import { CourseRegistrationEditorComponent } from './course-registration-editor/course-registration-editor.component';

// Kurs-Pendant zu TripRegistrationsComponent - ohne Boarding-Gruppierung/
// Kapazitäts-Prozent/Wartelisten-Zähler (course_registrations kennt beides
// nicht), dafür Sportart/Könnerstufe-Spalten.
@Component({
    selector: 'app-course-registrations',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, CourseRegistrationEditorComponent],
    templateUrl: './course-registrations.component.html',
    styleUrls: ['./course-registrations.component.scss'],
})
export class CourseRegistrationsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public tile: Tile | null = null;
    public registrations: CourseRegistration[] = [];
    public selectedRegistration: CourseRegistration | null = null;
    public tileId!: string;

    ngOnInit(): void {
        this.tileId = String(this.route.snapshot.paramMap.get('tileId'));
        this.dataService.getTile(this.tileId).subscribe((tile) => {
            this.tile = tile;
            this.cdr.markForCheck();
        });
        this.refresh();
    }

    // Zoneless change detection (see app.config.ts) - refresh() is also
    // called from the editor's async save callback, so mark here to cover
    // every call site uniformly.
    refresh(): void {
        this.dataService.getCourseRegistrations(this.tileId).subscribe((registrations) => {
            this.registrations = registrations;
            this.cdr.markForCheck();
        });
    }

    get confirmedCount(): number {
        return this.registrations.filter((r) => r.status === 'confirmed').length;
    }

    onBack(): void {
        this.router.navigate(['course-management', 'registrations']);
    }

    onCreate(): void {
        this.selectedRegistration = {
            id: '',
            tileId: this.tileId,
            firstName: '',
            lastName: '',
            isMember: false,
            status: 'confirmed',
            source: 'manual',
            orderIndex: 0,
        };
    }

    onEdit(registration: CourseRegistration): void {
        this.selectedRegistration = { ...registration };
    }

    onDelete(registration: CourseRegistration): void {
        if (!confirm(`Anmeldung von ${registration.firstName} ${registration.lastName} löschen?`)) return;
        this.dataService.deleteCourseRegistration(registration.id).subscribe(() => this.refresh());
    }

    onSaved(): void {
        this.selectedRegistration = null;
        this.refresh();
    }

    onPrint(): void {
        window.print();
    }
}
