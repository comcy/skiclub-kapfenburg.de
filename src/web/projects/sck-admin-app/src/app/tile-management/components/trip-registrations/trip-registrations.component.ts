import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { RegistrationAgeCategory, TripRegistration } from '../../domain/trip-registration';
import { Tile } from '../../domain/tile';
import { TileStatus } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';
import { RegistrationEditorComponent } from './registration-editor/registration-editor.component';

interface RegistrationGroup {
    boardingName: string;
    registrations: TripRegistration[];
}

@Component({
    selector: 'app-trip-registrations',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, RegistrationEditorComponent],
    templateUrl: './trip-registrations.component.html',
    styleUrls: ['./trip-registrations.component.scss'],
})
export class TripRegistrationsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public tile: Tile | null = null;
    public registrations: TripRegistration[] = [];
    public selectedRegistration: TripRegistration | null = null;
    public tileId!: string;
    public readonly tileStatusEnum = TileStatus;

    public readonly ageCategoryLabels: Record<RegistrationAgeCategory, string> = {
        adult: 'Erwachsen',
        youthUntil16: 'Jugend (bis 16)',
        childUntil6: 'Kind (bis 6)',
    };

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
        this.dataService.getRegistrations(this.tileId).subscribe((registrations) => {
            this.registrations = registrations;
            this.cdr.markForCheck();
        });
    }

    get confirmedCount(): number {
        return this.registrations.filter((r) => r.status === 'confirmed').length;
    }

    get waitlistCount(): number {
        return this.registrations.filter((r) => r.status === 'waitlist').length;
    }

    get capacityPercent(): number {
        if (!this.tile?.capacity) return 0;
        return Math.min(100, Math.round((this.confirmedCount / this.tile.capacity) * 100));
    }

    get isOverCapacity(): boolean {
        return !!this.tile?.capacity && this.confirmedCount >= this.tile.capacity;
    }

    get tileStatusLabel(): string {
        switch (this.tile?.status) {
            case TileStatus.Canceled:
                return 'Abgesagt';
            case TileStatus.BookedUp:
                return 'Warteliste';
            default:
                return this.isOverCapacity ? 'Warteliste' : 'Offen';
        }
    }

    get groups(): RegistrationGroup[] {
        const byBoarding = new Map<string, TripRegistration[]>();
        for (const registration of this.registrations) {
            const key = registration.boardingName || 'Ohne Boarding-Ort';
            if (!byBoarding.has(key)) byBoarding.set(key, []);
            byBoarding.get(key)!.push(registration);
        }
        return Array.from(byBoarding.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([boardingName, registrations]) => ({ boardingName, registrations }));
    }

    onBack(): void {
        this.router.navigate(['event-management', 'tiles', this.tileId]);
    }

    onCreate(): void {
        this.selectedRegistration = {
            id: '',
            tileId: this.tileId,
            firstName: '',
            lastName: '',
            ageCategory: 'adult',
            isMember: false,
            status: 'confirmed',
            source: 'manual',
            orderIndex: 0,
        };
    }

    onEdit(registration: TripRegistration): void {
        this.selectedRegistration = { ...registration };
    }

    onDelete(registration: TripRegistration): void {
        if (!confirm(`Anmeldung von ${registration.firstName} ${registration.lastName} löschen?`)) return;
        this.dataService.deleteRegistration(registration.id).subscribe(() => this.refresh());
    }

    onSaved(): void {
        this.selectedRegistration = null;
        this.refresh();
    }

    onPrint(): void {
        window.print();
    }
}
