import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {
    RegistrationAgeCategory,
    RegistrationStatus,
    TripRegistration,
    TripRegistrationCreationParams,
} from '../../domain/trip-registration';
import { NewsService } from '../../../shared/services/news.service';
import { RegistrationAlertKey, RegistrationAlerts, registrationAlerts } from '../../domain/registration-alerts';
import { compareValues } from '../../../shared/utils/sort';
import { CourseInstructor } from '../../domain/course-instructor';
import { CourseInstructorsComponent } from '../course-instructors/course-instructors.component';
import { CourseGroup, courseGroups } from '../../domain/registration-courses';
import { guardianOf, isMinor, minorState } from '../../domain/registration-minor';
import { TeachingTeamEntry, Tile } from '../../domain/tile';
import { SettingsDataService } from '../../../settings/services/settings-data.service';
import { ParticipationFeeSetting } from '../../../settings/domain/participation-fee-setting';
import { TripPricingSetting } from '../../../settings/domain/trip-pricing-setting';
import { TileStatus } from '../../domain/tile-enums';
import { TilesDataService, TripPricePreviewParticipant } from '../../services/tiles-data.service';
import { BulkRegistrationDialogComponent } from './bulk-registration-dialog/bulk-registration-dialog.component';
import { RegistrationEditDialogComponent } from './registration-edit-dialog/registration-edit-dialog.component';

interface PriceRow {
    label: string;
    member: number;
    nonMember: number;
}

// Uhrzeit aus dem Abfahrtsort-Namen, z.B. "Westhausen Turnhalle (5:15 Uhr)" -> Minuten seit 0:00.
export function boardingTimeMinutes(name: string): number | undefined {
    const match = name.match(/(\d{1,2})[:.](\d{2})/);
    return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
}

// Hauptanmelder zuerst, direkt darunter die über ihn Angemeldeten - aber nur, wenn sie in derselben Gruppe
// (gleicher Zustieg/Warteliste) stehen, sonst stehen sie allein. Reihenfolge der Hauptanmelder per `compare`,
// die Angemeldeten darunter nach Nachname/Vorname.
export function orderWithHeads(
    list: TripRegistration[],
    compare: (a: TripRegistration, b: TripRegistration) => number,
): { ordered: TripRegistration[]; linkedIds: Set<string> } {
    const ids = new Set(list.map((r) => r.id));
    const isLinked = (r: TripRegistration) => !!r.registeredById && ids.has(r.registeredById);
    const byName = (a: TripRegistration, b: TripRegistration) =>
        a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de');
    const ordered: TripRegistration[] = [];
    const linkedIds = new Set<string>();
    for (const head of list.filter((r) => !isLinked(r)).sort(compare)) {
        ordered.push(head);
        for (const member of list.filter((r) => r.registeredById === head.id).sort(byName)) {
            ordered.push(member);
            linkedIds.add(member.id);
        }
    }
    return { ordered, linkedIds };
}

interface RegistrationGroup {
    linkedIds: Set<string>;
    boardingName: string;
    waitlist?: boolean;
    registrations: TripRegistration[];
}

@Component({
    selector: 'app-trip-registrations',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSortModule,
        MatTooltipModule,
        CourseInstructorsComponent,
    ],
    templateUrl: './trip-registrations.component.html',
    styleUrls: ['./trip-registrations.component.scss'],
})
export class TripRegistrationsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly news = inject(NewsService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);
    private readonly settings = inject(SettingsDataService);
    public readonly auth = inject(AuthService);

    public tile: Tile | null = null;
    public organizers: TeachingTeamEntry[] = [];
    public globalPricing: TripPricingSetting = {};
    public fees: ParticipationFeeSetting | null = null;
    public showConditions = false;
    public seenBefore: string | null = null;
    public registrations: TripRegistration[] = [];
    public tileId!: string;
    public readonly tileStatusEnum = TileStatus;
    // Keyed by registration id - populated by refresh() via a single batched
    // /trip-price-preview call (see TilesDataService), reusing sck-api's own
    // pricing calc instead of a fourth copy of it here.
    public pricesByRegistrationId = new Map<string, number>();

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
        this.dataService.getCourseInstructors(this.tileId).subscribe((all) => this.onInstructors(all));
        this.dataService.getTeachingTeam().subscribe((team) => {
            this.organizers = team;
            this.cdr.markForCheck();
        });
        this.settings.getTripPricing().subscribe((pricing) => {
            this.globalPricing = pricing;
            this.cdr.markForCheck();
        });
        this.settings.getParticipationFees().subscribe((fees) => {
            this.fees = fees;
            this.cdr.markForCheck();
        });
        // Liste gilt ab jetzt als gesehen; die Neu-Badges dieses Besuchs richten sich nach dem vorherigen Stand.
        this.news.markListSeen(this.tileId).subscribe((previous) => {
            this.seenBefore = previous;
            this.refresh();
        });
    }

    // Zoneless change detection (see app.config.ts) - refresh() is also
    // called from the editor's async save callback, so mark here to cover
    // every call site uniformly.
    refresh(): void {
        this.dataService.getRegistrations(this.tileId).subscribe((registrations) => {
            this.registrations = registrations;
            this.refreshPrices(registrations);
            this.cdr.markForCheck();
        });
    }

    private refreshPrices(registrations: TripRegistration[]): void {
        if (!registrations.length) {
            this.pricesByRegistrationId = new Map();
            return;
        }
        const participants: TripPricePreviewParticipant[] = registrations.map((r) => ({
            registrationId: r.id,
            birthday: r.birthday,
            ageCategory: r.ageCategory,
            // The final, effective member status (possibly admin-corrected,
            // see registration-editor.component.ts) - what would actually be
            // charged, not necessarily what the participant self-reported.
            isMember: r.isMember,
            busOnly: r.busOnly,
            snowshoes: r.snowshoes,
            courseRequested: r.courseRequested,
            level: r.level,
        }));
        // Die API erlaubt höchstens 20 Teilnehmer pro Preisberechnung - größere Listen in Blöcken abfragen.
        const chunks: TripPricePreviewParticipant[][] = [];
        for (let i = 0; i < participants.length; i += 20) chunks.push(participants.slice(i, i + 20));
        forkJoin(chunks.map((chunk) => this.dataService.getTripPricePreview(this.tileId, chunk))).subscribe(
            (results) => {
                const prices = results.flatMap((result) => result.prices);
                this.pricesByRegistrationId = new Map(registrations.map((r, i) => [r.id, prices[i]]));
                this.cdr.markForCheck();
            },
        );
    }

    // Birthday is a plain ISO date (see registration-editor.component.ts) -
    // simple enough to inline rather than pull in a date-time util just for
    // this one admin table.
    public exactAge(birthday: string | undefined): number | undefined {
        if (!birthday) return undefined;
        const dob = new Date(birthday);
        if (isNaN(dob.getTime())) return undefined;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const hadBirthdayThisYear =
            today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
        if (!hadBirthdayThisYear) age -= 1;
        return age;
    }

    get organizerNames(): string {
        const ids = this.tile?.responsibleMemberIds ?? [];
        return this.organizers
            .filter((m) => ids.includes(m.id))
            .map((m) => `${m.firstName} ${m.lastName}`)
            .join(', ');
    }

    // Wirksame Preise wie auf der öffentlichen Seite: eigene Preise der Ausfahrt, sonst globale Preisverwaltung.
    get priceRows(): PriceRow[] {
        const cfg = this.tile?.tripConfig;
        const own = cfg?.pricing;
        const hasOwn = !!(own && (own.busLift || own.busOnly || own.addons));
        const base = hasOwn ? own! : this.globalPricing;
        const rows: PriceRow[] = [];
        const ages: RegistrationAgeCategory[] = cfg?.adultsOnly ? ['adult'] : ['adult', 'youthUntil16', 'childUntil6'];
        for (const age of ages) {
            const price = base.busLift?.[age];
            if (price) rows.push({ label: `Bus + Lift – ${this.ageCategoryLabels[age]}`, ...price });
        }
        if (base.busOnly) rows.push({ label: 'Nur Busfahrt', ...base.busOnly });
        const addons: [string, { member: number; nonMember: number } | undefined][] = [
            ['Schneeschuhe', own?.addons?.snowshoes],
            ...(cfg?.hasCourseOption
                ? ([
                      ['Anfängerkurs', base.addons?.courseBeginner],
                      ['Techniktraining (1/2 Tag)', base.addons?.technikHalf],
                      ['Techniktraining (ganzer Tag)', base.addons?.technikFull],
                  ] as [string, { member: number; nonMember: number } | undefined][])
                : []),
        ];
        for (const [label, price] of addons) if (price) rows.push({ label, ...price });
        return rows;
    }

    // Alter für die Tabelle: exakt, sonst Kürzel der Altersgruppe (E = Erwachsen, J = Jugend, K = Kind).
    ageDisplay(r: TripRegistration): string | number {
        return this.exactAge(r.birthday) ?? { adult: 'E', youthUntil16: 'J', childUntil6: 'K' }[r.ageCategory];
    }

    // Banner: Unregelmäßigkeiten der Liste; ein Klick auf "Anzeigen" filtert die Tabelle darauf.
    public activeAlert: RegistrationAlertKey | null = null;
    // Standardmäßig eingeklappt (mehr Platz für die Tabelle).
    public showAlerts = false;
    public readonly alertDefs: { key: RegistrationAlertKey; icon: string; warn: boolean; text: string }[] = [
        {
            key: 'minors',
            icon: 'child_care',
            warn: true,
            text: 'Minderjährig ohne Einverständniserklärung bzw. teilnehmendes Elternteil:',
        },
        { key: 'unverified', icon: 'help_outline', warn: true, text: 'Mitglied angegeben, aber nicht verifiziert:' },
        { key: 'noContact', icon: 'mail_off', warn: true, text: 'Keine E-Mail-Adresse (keine Bestätigung möglich):' },
        { key: 'noBoarding', icon: 'directions_bus', warn: false, text: 'Kein Zustieg gewählt:' },
        { key: 'noBirthday', icon: 'cake', warn: false, text: 'Geburtsdatum fehlt (Alter/Preis manuell):' },
        { key: 'emergency', icon: 'event_seat', warn: false, text: 'Auf Notplätzen:' },
    ];

    get alerts(): RegistrationAlerts {
        return registrationAlerts(this.registrations, this.emergencyRegistrationIds);
    }

    get alertCount(): number {
        const alerts = this.alerts;
        return this.alertDefs.reduce((sum, def) => sum + alerts[def.key].length, 0);
    }

    get visibleRegistrations(): TripRegistration[] {
        return this.activeAlert ? this.alerts[this.activeAlert] : this.registrations;
    }

    toggleAlert(key: RegistrationAlertKey): void {
        this.activeAlert = this.activeAlert === key ? null : key;
    }

    // Ansicht: alle Anmeldungen (nach Zustieg) oder nur Kursanmeldungen (nach Sportart/Stufe, fürs Lehrpersonal).
    public view: 'all' | 'courses' = 'all';
    public instructors: CourseInstructor[] = [];
    onInstructors(all: CourseInstructor[]): void {
        this.instructors = all;
        this.cdr.markForCheck();
    }

    get courseGroupList(): CourseGroup[] {
        return courseGroups(this.registrations);
    }

    get courseCount(): number {
        return this.courseGroupList.reduce((sum, g) => sum + g.registrations.length, 0);
    }

    get confirmedCount(): number {
        return this.registrations.filter((r) => r.status === 'confirmed').length;
    }

    get waitlistCount(): number {
        return this.registrations.filter((r) => r.status === 'waitlist').length;
    }

    // Bestätigte jenseits der Capacity (nach Anmeldezeit) belegen Notplätze.
    get emergencyRegistrationIds(): Set<string> {
        const capacity = this.tile?.capacity;
        if (!capacity) return new Set();
        return new Set(
            this.registrations
                .filter((r) => r.status === 'confirmed')
                .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
                .slice(capacity)
                .map((r) => r.id),
        );
    }

    get emergencyUsed(): number {
        return this.emergencyRegistrationIds.size;
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

    // Nach Boarding-Ort gruppiert; Wartelisten-Anmeldungen stehen gesammelt am Ende (in Reihenfolge der Anmeldung),
    // damit sie nie in der Boarding-/Busplanung untergehen.
    public sort: Sort = { active: '', direction: '' };
    private readonly sortAccessors: Record<string, (r: TripRegistration) => string | number | undefined> = {
        name: (r) => `${r.lastName} ${r.firstName}`,
        age: (r) => (r.birthday ? -Date.parse(r.birthday) : undefined), // älter = größer
        member: (r) => (r.isMember ? 1 : 0),
        status: (r) => r.status,
        course: (r) => (r.courseRequested ? 1 : 0),
    };

    onSortChange(sort: Sort): void {
        this.sort = sort;
    }

    private compareBySort(a: TripRegistration, b: TripRegistration): number {
        const get = this.sortAccessors[this.sort.active];
        if (!get || !this.sort.direction) return 0;
        return compareValues(get(a), get(b), this.sort.direction);
    }

    get groups(): RegistrationGroup[] {
        const byBoarding = new Map<string, TripRegistration[]>();
        const waitlist: TripRegistration[] = [];
        for (const registration of this.visibleRegistrations) {
            if (registration.status === 'waitlist') {
                waitlist.push(registration);
                continue;
            }
            const key = registration.boardingName || 'Ohne Boarding-Ort';
            if (!byBoarding.has(key)) byBoarding.set(key, []);
            byBoarding.get(key)!.push(registration);
        }
        const groups: RegistrationGroup[] = Array.from(byBoarding.entries())
            // Nach Abfahrtszeit; ohne erkennbare Uhrzeit ans Ende, dann nach Name.
            .sort(([a], [b]) => {
                const ta = boardingTimeMinutes(a) ?? Infinity;
                const tb = boardingTimeMinutes(b) ?? Infinity;
                return ta === tb ? a.localeCompare(b) : ta < tb ? -1 : 1;
            })
            .map(([boardingName, list]) => {
                // Innerhalb eines Zustiegs nach Nachname (oder gewählter Spalte), Familien bleiben zusammen.
                const { ordered, linkedIds } = orderWithHeads(
                    list,
                    (a, b) =>
                        this.compareBySort(a, b) ||
                        a.lastName.localeCompare(b.lastName, 'de') ||
                        a.firstName.localeCompare(b.firstName, 'de') ||
                        (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
                );
                return { boardingName, registrations: ordered, linkedIds };
            });
        if (waitlist.length) {
            const { ordered, linkedIds } = orderWithHeads(waitlist, (x, y) =>
                (x.createdAt ?? '').localeCompare(y.createdAt ?? ''),
            );
            groups.push({
                boardingName: `Warteliste (${waitlist.length})`,
                waitlist: true,
                registrations: ordered,
                linkedIds,
            });
        }
        return groups;
    }

    courseLabel(r: TripRegistration): string {
        return [r.sportType, r.level].filter(Boolean).join(' · ');
    }

    // Druckansicht: gebuchte Leistungen in einer Zeile (Bus/Lift, Schneeschuhe; der Kurs hat eine eigene Spalte) - der Preis enthält sie bereits.
    servicesText(r: TripRegistration): string {
        const parts = [r.busOnly ? 'Nur Bus' : 'Bus + Lift'];
        if (r.snowshoes) parts.push('Schneeschuhe');
        return parts.join(' · ');
    }

    groupTotal(group: RegistrationGroup): number {
        return group.registrations.reduce((sum, r) => sum + (this.pricesByRegistrationId.get(r.id) ?? 0), 0);
    }

    // Summe aller bestätigten Anmeldungen (Warteliste zahlt noch nicht).
    get grandTotal(): number {
        return this.groups.filter((g) => !g.waitlist).reduce((sum, g) => sum + this.groupTotal(g), 0);
    }

    // Legende (Druck + Preise-Panel); hier ergänzen, wenn weitere Symbole hinzukommen.
    public readonly legendItems: { icon?: string; symbol?: string; tone?: string; label: string }[] = [
        { icon: 'family_restroom', tone: 'ok', label: 'Minderjährig: Elternteil nimmt teil' },
        { icon: 'verified_user', tone: 'ok', label: 'Minderjährig: Einverständnis der Eltern liegt vor' },
        { icon: 'warning', tone: 'open', label: 'Minderjährig: Einverständnis fehlt' },
        { icon: 'flag', label: 'Organisator' },
        { icon: 'school', label: 'Lehrteam' },
        { symbol: 'E · J · K', label: 'Erwachsen · Jugend · Kind (ohne Geburtsdatum)' },
    ];

    isMinor = isMinor;
    minorState = minorState;
    guardianOf = guardianOf;

    onBack(): void {
        this.router.navigate(['registrations', 'ausfahrten']);
    }

    onCreate(): void {
        this.openEditor({
            id: '',
            tileId: this.tileId,
            firstName: '',
            lastName: '',
            ageCategory: 'adult',
            isMember: false,
            selfReportedIsMember: false,
            status: 'confirmed',
            source: 'manual',
            orderIndex: 0,
            transferredToExternalList: false,
            guardianConsent: false,
            confirmationMailSent: false,
            busOnly: false,
            snowshoes: false,
            courseRequested: false,
        });
    }

    onBulkCreate(): void {
        this.dialog
            .open(BulkRegistrationDialogComponent, {
                data: { tileId: this.tileId, existing: this.registrations },
                width: '760px',
                maxWidth: '95vw',
            })
            .afterClosed()
            .subscribe((created: boolean | undefined) => {
                if (created) this.refresh();
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
        this.updateWith(registration, { transferredToExternalList: !registration.transferredToExternalList });
    }

    // Schnell-Umschalten Warteliste <-> Bestätigt direkt aus der Liste (Nachrücken von Hand).
    onSetStatus(registration: TripRegistration, status: RegistrationStatus): void {
        this.updateWith(registration, { status });
    }

    private updateWith(registration: TripRegistration, overrides: Partial<TripRegistrationCreationParams>): void {
        if (!this.auth.hasPermission('tiles:write')) return;

        const params: TripRegistrationCreationParams = {
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email || undefined,
            phone: registration.phone || undefined,
            birthday: registration.birthday || undefined,
            boardingId: registration.boardingId || undefined,
            ageCategory: registration.ageCategory,
            isMember: registration.isMember,
            status: registration.status,
            source: registration.source,
            notes: registration.notes || undefined,
            orderIndex: registration.orderIndex,
            transferredToExternalList: registration.transferredToExternalList,
            busOnly: registration.busOnly,
            snowshoes: registration.snowshoes,
            courseRequested: registration.courseRequested,
            level: registration.level,
            sportType: registration.sportType,
            registeredById: registration.registeredById,
            guardianName: registration.guardianName,
            guardianType: registration.guardianType,
            guardianConsent: registration.guardianConsent,
            ...overrides,
        };

        this.dataService.updateRegistration(registration.id, params).subscribe(() => this.refresh());
    }

    // Tab-getrennt, Spaltenfolge = sichtbare Spalten des Vereins-Sheets (Name,Vorname | Checkbox | Alter | Telefon |
    // Schneeschuh Verleih | Preis | Anzahlung | Skipass | Gesamt offen | Zustieg | eingetragen von).
    // Felder ohne Gegenstück im System bleiben leer. Geb. Datum/Kurs sind im Sheet nicht sichtbar -> nicht enthalten.
    sheetRow(registration: TripRegistration): string {
        return [
            `${registration.lastName}, ${registration.firstName}`,
            '',
            this.exactAge(registration.birthday) ?? '',
            registration.phone || '',
            registration.snowshoes ? 'ja' : '',
            String(this.pricesByRegistrationId.get(registration.id) ?? '').replace('.', ','),
            '',
            '',
            '',
            registration.boardingName || '',
            this.copierFirstName(),
        ].join('\t');
    }

    // Vorname des angemeldeten Admins: Mitglied zur E-Mail, sonst erster Teil der Adresse ("christian.x@" -> "Christian").
    private copierFirstName(): string {
        const session = this.auth.session();
        if (session?.firstName) return session.firstName;
        const first = session?.email.split('@')[0].split(/[._-]/)[0] ?? '';
        return first.charAt(0).toUpperCase() + first.slice(1);
    }

    onCopyRow(registration: TripRegistration): void {
        navigator.clipboard.writeText(this.sheetRow(registration)).then(() => {
            this.snackBar.open('Anmeldung in Zwischenablage kopiert', 'OK', { duration: 3000 });
        });
    }

    private openEditor(registration: TripRegistration): void {
        const dialogRef = this.dialog.open(RegistrationEditDialogComponent, {
            data: { tileId: this.tileId, tile: this.tile, registration, candidates: this.registrations },
            width: '640px',
            maxWidth: '95vw',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.refresh();
        });
    }

    // Merkt die Person dauerhaft als Mitglied (auch für künftige Anmeldungen, siehe member-match-service der API).
    onVerifyMember(registration: TripRegistration): void {
        const name = `${registration.firstName} ${registration.lastName}`;
        if (
            !confirm(
                `${name} als Mitglied verifizieren? Gilt auch für künftige Anmeldungen (Name${registration.birthday ? ' + Geburtsdatum' : ''}).`,
            )
        )
            return;
        this.dataService
            .createVerifiedPerson({
                firstName: registration.firstName,
                lastName: registration.lastName,
                birthday: registration.birthday || undefined,
            })
            .subscribe(() => this.updateWith(registration, { isMember: true }));
    }

    // Widerruft die verifizierte Person (kein Löschen) und nimmt die Markierung dieser Anmeldung zurück.
    onUnverifyMember(registration: TripRegistration): void {
        const name = `${registration.firstName} ${registration.lastName}`;
        if (!confirm(`Verifizierung von ${name} aufheben? Betrifft nur künftige Anmeldungen und diese hier.`)) return;
        const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
        this.dataService.listVerifiedPersons().subscribe((people) => {
            const matches = people.filter(
                (p) =>
                    same(p.firstName, registration.firstName) &&
                    same(p.lastName, registration.lastName) &&
                    (!p.birthday || !registration.birthday || p.birthday === registration.birthday),
            );
            const revokes = matches.map((p) => this.dataService.revokeVerifiedPerson(p.id));
            (revokes.length ? forkJoin(revokes) : of([])).subscribe(() =>
                this.updateWith(registration, { isMember: false }),
            );
        });
    }

    // Bestätigungsmail manuell senden - geht immer an den Hauptanmelder (bei über ihn Angemeldeten nur an ihn).
    onSendConfirmation(registration: TripRegistration): void {
        const recipient = registration.registeredByName || `${registration.firstName} ${registration.lastName}`;
        if (!confirm(`Bestätigungsmail an ${recipient} senden?`)) return;
        this.dataService.sendConfirmationMail(registration.id).subscribe({
            next: (result) => {
                this.snackBar.open(
                    result.sent
                        ? `Mail an ${result.recipient} gesendet.`
                        : 'Mailversand nicht konfiguriert (nicht gesendet).',
                    'OK',
                    { duration: 4000 },
                );
                this.refresh();
            },
            error: (err) =>
                this.snackBar.open(err?.error?.error ?? 'Mail konnte nicht gesendet werden.', 'OK', { duration: 5000 }),
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
