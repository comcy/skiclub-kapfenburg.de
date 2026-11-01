import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GERMAN_DATE_FORMATS, GermanDateAdapter } from 'projects/shared-lib/src/lib/date-time';
import { Member, MemberCreationParams } from '../../domain/member';
import { MembersDataService } from '../../services/members-data.service';

// "1985-03-26" -> local-time Date(1985, 2, 26), never UTC midnight (the
// plain `new Date("1985-03-26")` parse) - that would render as the
// previous day in timezones behind UTC. Falls back to a generic parse for
// anything not in that shape, and to null (an empty picker) for genuinely
// unparseable legacy free text rather than guessing.
const parseIsoDate = (value: string | undefined): Date | null => {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
        const [, year, month, day] = match;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
};

const toIsoDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

@Component({
    selector: 'app-member-editor',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
    ],
    providers: [
        { provide: DateAdapter, useClass: GermanDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
    templateUrl: './member-editor.component.html',
    styleUrls: ['./member-editor.component.scss'],
})
export class MemberEditorComponent implements OnInit, OnChanges {
    @Input() member: Member | null = null;
    @Output() saved = new EventEmitter<void>();

    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    // Familie: Hauptanmelder per Suche wählen (statt Gruppen-ID von Hand). Alle Mitglieder einmal geladen,
    // Suche/Vorschläge laufen im Speicher.
    private allMembers: Member[] = [];
    public referent: Member | null = null;
    public referentQuery = '';

    ngOnInit(): void {
        this.dataService.getMembers(1, 10000).subscribe((response) => {
            this.allMembers = response.items;
            this.cdr.markForCheck();
        });
    }

    private static norm = (value: string | undefined): string =>
        (value ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

    // Beste Treffer zuerst: Suchbegriffe in Name (Anfang zählt mehr); gleiche Adresse/gleicher Nachname geben
    // Bonus. Ohne Suchtext nur Vorschläge (gleiche Adresse oder gleicher Nachname).
    get referentOptions(): Member[] {
        if (!this.member) return [];
        const self = this.member;
        const tokens = MemberEditorComponent.norm(this.referentQuery).split(' ').filter(Boolean);
        const address = MemberEditorComponent.norm(self.address);
        const last = MemberEditorComponent.norm(self.lastName);
        return this.allMembers
            .filter((m) => m.id !== self.id)
            .map((m) => {
                const name = MemberEditorComponent.norm(`${m.firstName} ${m.lastName}`);
                const sameAddress = !!address && MemberEditorComponent.norm(m.address) === address;
                const sameLast = !!last && MemberEditorComponent.norm(m.lastName) === last;
                let score = (sameAddress ? 2 : 0) + (sameLast ? 2 : 0);
                if (tokens.length) {
                    if (!tokens.every((t) => name.includes(t) || MemberEditorComponent.norm(m.address).includes(t))) {
                        return { m, score: -1 };
                    }
                    score += tokens.reduce((sum, t) => sum + (name.split(' ').some((w) => w.startsWith(t)) ? 3 : 1), 0);
                } else if (!sameAddress && !sameLast) {
                    return { m, score: -1 };
                }
                return { m, score };
            })
            .filter((x) => x.score >= 0)
            .sort((a, b) => b.score - a.score || a.m.lastName.localeCompare(b.m.lastName))
            .slice(0, 8)
            .map((x) => x.m);
    }

    // Weitere Personen der aktuellen Familiengruppe (Anzeige "Familie mit …").
    get familyMates(): Member[] {
        const group = this.member?.familyGroupId;
        if (!group) return [];
        return this.allMembers.filter((m) => m.familyGroupId === group && m.id !== this.member?.id);
    }

    // Gleiche Adresse, aber (noch) nicht in dieser Familie -> Verknüpfung vorschlagen.
    get addressSuggestions(): Member[] {
        const address = MemberEditorComponent.norm(this.member?.address);
        if (!this.member || !address || this.referent) return [];
        return this.allMembers
            .filter(
                (m) =>
                    m.id !== this.member?.id &&
                    MemberEditorComponent.norm(m.address) === address &&
                    !(m.familyGroupId && m.familyGroupId === this.member?.familyGroupId),
            )
            .slice(0, 3);
    }

    get familyNames(): string {
        return this.familyMates.map((m) => `${m.firstName} ${m.lastName}`).join(', ');
    }

    // Nach der Auswahl bleibt das Suchfeld leer (die Auswahl steht als "Familie von …" darunter).
    readonly noDisplay = (): string => '';

    selectReferent(member: Member): void {
        if (!this.member) return;
        this.referent = member;
        this.referentQuery = '';
        this.member.isFamilyMembership = true;
        this.cdr.markForCheck();
    }

    onReferentSelected(event: MatAutocompleteSelectedEvent): void {
        this.selectReferent(event.option.value as Member);
    }

    onFamilyToggle(on: boolean): void {
        if (!this.member) return;
        this.member.isFamilyMembership = on;
        if (!on) {
            this.referent = null;
            this.referentQuery = '';
            this.member.familyGroupId = undefined;
        }
    }

    clearReferent(): void {
        this.referent = null;
        this.cdr.markForCheck();
    }

    // The datepicker (GermanDateAdapter) needs a real Date, but
    // Member.birthday/memberSince are ISO strings (the wire format every
    // other consumer of Member expects) - kept as separate local state
    // rather than changing that type, converted both ways at the edges.
    public birthdayDate: Date | null = null;
    public memberSinceDate: Date | null = null;

    // Not the id check of "new-..." tiles use - members created from scratch
    // or from an application both start with id: '', same as boardings.
    get isFromApplication(): boolean {
        return !this.member?.id && !!this.member?.applicationRegistrationId;
    }

    // Read by member-edit-dialog's own Speichern button (now outside this
    // component, in the dialog shell's sticky actions area).
    get canSave(): boolean {
        return !!this.member?.firstName && !!this.member?.lastName;
    }

    // member-list can swap `member` to a different row's object while this
    // editor stays mounted (selectedMember never passes through null in
    // that case) - resync the local Date fields whenever the input changes,
    // not just on first mount.
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['member']) {
            this.referent = null;
            this.referentQuery = '';
            this.birthdayDate = parseIsoDate(this.member?.birthday);
            this.memberSinceDate = parseIsoDate(this.member?.memberSince);
        }
    }

    onSave(): void {
        if (!this.member) return;

        const params: MemberCreationParams = {
            firstName: this.member.firstName,
            lastName: this.member.lastName,
            email: this.member.email || undefined,
            phone: this.member.phone || undefined,
            mobile: this.member.mobile || undefined,
            birthday: this.birthdayDate ? toIsoDate(this.birthdayDate) : undefined,
            address: this.member.address || undefined,
            isFamilyMembership: this.member.isFamilyMembership,
            familyGroupId: this.member.isFamilyMembership ? this.member.familyGroupId || undefined : undefined,
            familyReferentId: this.member.isFamilyMembership ? this.referent?.id : undefined,
            status: this.member.status,
            source: this.member.source,
            applicationRegistrationId: this.member.applicationRegistrationId || undefined,
            notes: this.member.notes || undefined,
            memberSince: this.memberSinceDate ? toIsoDate(this.memberSinceDate) : undefined,
            externalId: this.member.externalId || undefined,
            iban: this.member.iban || undefined,
            bic: this.member.bic || undefined,
            bankName: this.member.bankName || undefined,
            accountHolder: this.member.accountHolder || undefined,
            paymentMethod: this.member.paymentMethod || undefined,
            isTeachingTeam: !!this.member.isTeachingTeam,
        };

        // Zoneless change detection (see app.config.ts) - without
        // markForCheck() the parent's editor panel wouldn't visibly close.
        if (this.member.id) {
            this.dataService.updateMember(this.member.id, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        } else {
            this.dataService.createMember(params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        }
    }
}
