import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { calculateAge } from 'projects/shared-lib/src/lib/date-time';
import { AuthService } from '../../../auth/services/auth.service';
import { CourseRegistration, CourseRegistrationCreationParams } from '../../domain/course-registration';
import { NewsService } from '../../../shared/services/news.service';
import { Tile } from '../../domain/tile';
import { SkiCoursePricingSetting } from '../../../settings/domain/ski-course-pricing-setting';
import { SettingsDataService } from '../../../settings/services/settings-data.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { CourseRegistrationEditorComponent } from './course-registration-editor/course-registration-editor.component';

// Kurs-Pendant zu TripRegistrationsComponent - ohne Boarding-Gruppierung/
// Kapazitäts-Prozent/Wartelisten-Zähler (course_registrations kennt beides
// nicht), dafür Sportart/Könnerstufe-Spalten.
@Component({
    selector: 'app-course-registrations',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        CourseRegistrationEditorComponent,
    ],
    templateUrl: './course-registrations.component.html',
    styleUrls: ['./course-registrations.component.scss'],
})
export class CourseRegistrationsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly settingsService = inject(SettingsDataService);
    private readonly snackBar = inject(MatSnackBar);
    public readonly auth = inject(AuthService);
    public readonly news = inject(NewsService);

    public tile: Tile | null = null;
    public seenBefore: string | null = null;
    public registrations: CourseRegistration[] = [];
    public selectedRegistration: CourseRegistration | null = null;
    public tileId!: string;
    // Optional per ?sport=... auf eine Sportart eingeschränkt (A1 Ski vs. A1 Snowboard).
    public sport: string | null = null;
    // Globale Ski-/Snowboardkurs-Preise (Einstellungen -> Preismanagement).
    private skiPricing: SkiCoursePricingSetting | null = null;

    ngOnInit(): void {
        this.tileId = String(this.route.snapshot.paramMap.get('tileId'));
        this.sport = this.route.snapshot.queryParamMap.get('sport');
        this.dataService.getTile(this.tileId).subscribe((tile) => {
            this.tile = tile;
            this.cdr.markForCheck();
        });
        // Liste gilt ab jetzt als gesehen; die Neu-Badges dieses Besuchs richten sich nach dem vorherigen Stand.
        this.news.markListSeen(this.tileId).subscribe((previous) => {
            this.seenBefore = previous;
            this.refresh();
        });
        this.settingsService.getSkiCoursePricing().subscribe((pricing) => {
            this.skiPricing = pricing;
            this.cdr.markForCheck();
        });
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

    get visibleRegistrations(): CourseRegistration[] {
        return this.sport ? this.registrations.filter((r) => r.sportType === this.sport) : this.registrations;
    }

    get confirmedCount(): number {
        return this.visibleRegistrations.filter((r) => r.status === 'confirmed').length;
    }

    age(registration: CourseRegistration): number | null {
        const age = calculateAge(registration.birthday);
        return isNaN(age) ? null : age;
    }

    // Member vs. non-member price is set once per course tile (see the
    // "Dies ist ein Pilates-/Gymnastik-Kurs" editor section) - free text
    // (e.g. "80 €", not a number), so read as-is rather than computed here.
    price(registration: CourseRegistration): string | null {
        const prices = this.tile?.course?.prices;
        if (prices) return registration.isMember ? prices.member : prices.nonMember;
        return this.skiPrice(registration);
    }

    // Ski-/Snowboardkurse haben keinen Preis am Tile: Betrag wie im Formular und in der
    // Bestaetigungsmail aus den globalen Kurspreisen (Sportart, Alter, Mitglied). Mitglied =
    // verifiziert/gesetzt ODER angegeben, wie in der Mail. ponytail: mit den AKTUELLEN Preisen
    // berechnet, nicht beim Anmelden gespeichert - bei einem Preiswechsel mitten in der Saison
    // zeigen alte Anmeldungen den neuen Betrag (dann Betrag je Anmeldung speichern).
    private skiPrice(registration: CourseRegistration): string | null {
        const pricing = this.skiPricing;
        const age = calculateAge(registration.birthday);
        if (!pricing?.alpine || !pricing.snowboard || !registration.sportType || isNaN(age)) return null;
        const group = registration.sportType === 'Ski Alpin' ? pricing.alpine : pricing.snowboard;
        const bracket = age < pricing.childUntilAge ? group.child : group.adult;
        const member = registration.isMember || registration.selfReportedIsMember;
        const amount = member ? bracket.member : bracket.nonMember;
        return amount > 0 ? `${amount} €` : null;
    }

    onBack(): void {
        this.router.navigate(['registrations', 'kurse']);
    }

    onCreate(): void {
        this.selectedRegistration = {
            id: '',
            tileId: this.tileId,
            sportType: this.sport ?? undefined,
            firstName: '',
            lastName: '',
            isMember: false,
            selfReportedIsMember: false,
            status: 'confirmed',
            source: 'manual',
            orderIndex: 0,
            paid: false,
            transferredToExternalList: false,
            confirmationMailSent: false,
        };
    }

    onEdit(registration: CourseRegistration): void {
        this.selectedRegistration = { ...registration };
    }

    // Table-badge shortcut for the same field the editor's checkbox sets -
    // built field-by-field (not a spread) so a forgotten field here is a
    // compile error, matching the editor's onSave() style.
    onToggleTransferred(registration: CourseRegistration): void {
        if (!this.auth.hasPermission('tiles:write')) return;

        const params: CourseRegistrationCreationParams = {
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email || undefined,
            phone: registration.phone || undefined,
            birthday: registration.birthday || undefined,
            sportType: registration.sportType || undefined,
            level: registration.level || undefined,
            groupId: registration.groupId || undefined,
            isMember: registration.isMember,
            selfReportedIsMember: registration.selfReportedIsMember,
            status: registration.status,
            source: registration.source,
            notes: registration.notes || undefined,
            orderIndex: registration.orderIndex,
            paid: registration.paid,
            transferredToExternalList: !registration.transferredToExternalList,
        };

        this.dataService.updateCourseRegistration(registration.id, params).subscribe(() => this.refresh());
    }

    // Tab-separated so it pastes as a ready-made row into Google Sheets
    // (see GitHub #185) - column order matches the visible table plus the
    // contact fields Mike's external list actually needs but the table
    // doesn't show a dedicated column for (name/vorname are already split).
    onCopyRow(registration: CourseRegistration): void {
        const row = [
            registration.lastName,
            registration.firstName,
            registration.birthday || '',
            registration.email || '',
            registration.phone || '',
            registration.isMember
                ? 'Mitglied'
                : registration.selfReportedIsMember
                  ? 'Mitglied (nicht verifiziert)'
                  : 'kein Mitglied',
            registration.sportType || '',
            registration.level || '',
            this.price(registration) ?? '',
            registration.paid ? 'bezahlt' : 'offen',
            registration.notes || '',
        ].join('\t');

        navigator.clipboard.writeText(row).then(() => {
            this.snackBar.open('Anmeldung in Zwischenablage kopiert', 'OK', { duration: 3000 });
        });
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
