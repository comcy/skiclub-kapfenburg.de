import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GERMAN_DATE_FORMATS } from 'projects/shared-lib/src/lib/date-time';
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
        MatButtonModule,
        MatDatepickerModule,
    ],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
    templateUrl: './member-editor.component.html',
    styleUrls: ['./member-editor.component.scss'],
})
export class MemberEditorComponent implements OnChanges {
    @Input() member: Member | null = null;
    @Output() saved = new EventEmitter<void>();

    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    // The datepicker (provideNativeDateAdapter) needs a real Date, but
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
            familyGroupId: this.member.familyGroupId || undefined,
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
