import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {
    RegistrationAgeCategory,
    TripRegistration,
    TripRegistrationCreationParams,
} from '../../domain/trip-registration';
import { Tile } from '../../domain/tile';
import { TileStatus } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';
import { RegistrationEditDialogComponent } from './registration-edit-dialog/registration-edit-dialog.component';

interface RegistrationGroup {
    boardingName: string;
    registrations: TripRegistration[];
}

@Component({
    selector: 'app-trip-registrations',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './trip-registrations.component.html',
    styleUrls: ['./trip-registrations.component.scss'],
})
export class TripRegistrationsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);
    public readonly auth = inject(AuthService);

    public tile: Tile | null = null;
    public registrations: TripRegistration[] = [];
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
        this.router.navigate(['registrations']);
    }

    onCreate(): void {
        this.openEditor({
            id: '',
            tileId: this.tileId,
            firstName: '',
            lastName: '',
            ageCategory: 'adult',
            isMember: false,
            status: 'confirmed',
            source: 'manual',
            orderIndex: 0,
            transferredToExternalList: false,
            confirmationMailSent: false,
            busOnly: false,
            snowshoes: false,
            courseRequested: false,
        });
    }

    onEdit(registration: TripRegistration): void {
        this.openEditor({ ...registration });
    }

    // Table-badge shortcut for the same field the editor's checkbox sets -
    // built field-by-field (not a spread) so a forgotten field here is a
    // compile error, matching the editor's onSave() style. Also the reason
    // busOnly/snowshoes/courseRequested/level are carried through explicitly
    // - a spread of a stale `registration` would be fine here since it's the
    // same object as the row, but explicit fields keep this in sync with the
    // editor and catch a future field added to TripRegistration at compile
    // time instead of silently dropping it on the next toggle.
    onToggleTransferred(registration: TripRegistration): void {
        if (!this.auth.hasPermission('tiles:write')) return;

        const params: TripRegistrationCreationParams = {
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email || undefined,
            phone: registration.phone || undefined,
            boardingId: registration.boardingId || undefined,
            ageCategory: registration.ageCategory,
            status: registration.status,
            source: registration.source,
            notes: registration.notes || undefined,
            orderIndex: registration.orderIndex,
            transferredToExternalList: !registration.transferredToExternalList,
            busOnly: registration.busOnly,
            snowshoes: registration.snowshoes,
            courseRequested: registration.courseRequested,
            level: registration.level,
        };

        this.dataService.updateRegistration(registration.id, params).subscribe(() => this.refresh());
    }

    // Tab-separated so it pastes as a ready-made row into Google Sheets
    // (see GitHub #185) - includes the contact/option fields the table
    // itself doesn't show a column for, since the point is a complete row.
    onCopyRow(registration: TripRegistration): void {
        const row = [
            registration.firstName,
            registration.lastName,
            this.ageCategoryLabels[registration.ageCategory],
            registration.isMember ? 'Mitglied' : 'kein Mitglied',
            registration.boardingName || '',
            registration.email || '',
            registration.phone || '',
            registration.busOnly ? 'ja' : 'nein',
            registration.snowshoes ? 'ja' : 'nein',
            registration.courseRequested ? registration.level || 'ja' : 'nein',
            registration.status,
            registration.notes || '',
        ].join('\t');

        navigator.clipboard.writeText(row).then(() => {
            this.snackBar.open('Anmeldung in Zwischenablage kopiert', 'OK', { duration: 3000 });
        });
    }

    private openEditor(registration: TripRegistration): void {
        const dialogRef = this.dialog.open(RegistrationEditDialogComponent, {
            data: { tileId: this.tileId, registration },
            width: '640px',
            maxWidth: '95vw',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.refresh();
        });
    }

    onDelete(registration: TripRegistration): void {
        if (!confirm(`Anmeldung von ${registration.firstName} ${registration.lastName} löschen?`)) return;
        this.dataService.deleteRegistration(registration.id).subscribe(() => this.refresh());
    }

    onPrint(): void {
        window.print();
    }
}
