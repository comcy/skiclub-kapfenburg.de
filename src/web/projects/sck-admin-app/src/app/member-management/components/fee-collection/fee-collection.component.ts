import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GERMAN_DATE_FORMATS } from 'projects/shared-lib/src/lib/date-time';
import { AuthService } from '../../../auth/services/auth.service';
import { MembershipFeeSetting } from '../../../settings/domain/membership-fee-setting';
import { SepaCreditorSetting } from '../../../settings/domain/sepa-creditor-setting';
import { SettingsDataService } from '../../../settings/services/settings-data.service';
import { SepaExportCandidate, SepaExportPreview, SepaSequenceType } from '../../domain/sepa-export';
import { MembersDataService } from '../../services/members-data.service';

// Same day-precision ISO conversion as member-editor.component.ts's
// toIsoDate() - duplicated rather than shared for a two-call-site helper.
const toIsoDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

@Component({
    selector: 'app-fee-collection',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        CurrencyPipe,
        DatePipe,
    ],
    templateUrl: './fee-collection.component.html',
    styleUrls: ['./fee-collection.component.scss'],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
})
export class FeeCollectionComponent implements OnInit {
    private readonly settingsService = inject(SettingsDataService);
    private readonly membersService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public creditor: SepaCreditorSetting = { creditorName: '', creditorId: '', iban: '', bic: '' };
    public fees: MembershipFeeSetting = { individual: 0, family: 0 };
    public isCreditorSaved = false;
    public isFeeSaved = false;

    public candidates: SepaExportCandidate[] = [];
    public selectedIds = new Set<string>();
    public readonly candidateColumns = ['select', 'name', 'familyGroup', 'iban'];

    public executionDate: Date | null = null;
    public sequenceType: SepaSequenceType = 'FRST';

    public preview: SepaExportPreview | null = null;
    public isGenerating = false;
    public errorMessage = '';

    ngOnInit(): void {
        if (!this.auth.hasPermission('sepa:export')) return;

        this.settingsService.getSepaCreditor().subscribe((setting) => {
            this.creditor = setting;
            this.cdr.markForCheck();
        });
        this.settingsService.getMembershipFee().subscribe((setting) => {
            this.fees = setting;
            this.cdr.markForCheck();
        });
        this.membersService.getSepaExportCandidates().subscribe((candidates) => {
            this.candidates = candidates;
            // Pre-select everyone who actually has an IBAN on file - members
            // without one would just show up as a preview warning anyway.
            this.selectedIds = new Set(candidates.filter((c) => c.hasIban).map((c) => c.id));
            this.cdr.markForCheck();
        });
    }

    onSaveCreditor(): void {
        this.isCreditorSaved = false;
        this.settingsService.updateSepaCreditor(this.creditor).subscribe(() => {
            this.isCreditorSaved = true;
            this.cdr.markForCheck();
        });
    }

    onSaveFees(): void {
        this.isFeeSaved = false;
        this.settingsService.updateMembershipFee(this.fees).subscribe(() => {
            this.isFeeSaved = true;
            this.cdr.markForCheck();
        });
    }

    isSelected(id: string): boolean {
        return this.selectedIds.has(id);
    }

    toggleSelected(id: string): void {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
    }

    selectAll(): void {
        this.selectedIds = new Set(this.candidates.map((c) => c.id));
    }

    selectNone(): void {
        this.selectedIds = new Set();
    }

    onPreview(): void {
        this.errorMessage = '';
        this.preview = null;
        this.membersService.previewSepaExport([...this.selectedIds]).subscribe({
            next: (preview) => {
                this.preview = preview;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.errorMessage = err.error?.error ?? 'Fehler bei der Vorschau.';
                this.cdr.markForCheck();
            },
        });
    }

    onDownload(): void {
        if (!this.executionDate) {
            this.errorMessage = 'Bitte ein Fälligkeitsdatum wählen.';
            return;
        }
        this.errorMessage = '';
        this.isGenerating = true;
        const executionDateIso = toIsoDate(this.executionDate);

        this.membersService.generateSepaExport([...this.selectedIds], executionDateIso, this.sequenceType).subscribe({
            next: (blob) => {
                this.isGenerating = false;
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `sepa-lastschrift-${executionDateIso}.xml`;
                link.click();
                URL.revokeObjectURL(url);
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.isGenerating = false;
                // responseType: 'blob' means a JSON error body from the
                // server also arrives as a Blob, not parsed JSON - read it
                // back out as text instead of showing a raw [object Blob].
                if (err.error instanceof Blob) {
                    err.error.text().then((text: string) => {
                        this.errorMessage = JSON.parse(text)?.error ?? 'Fehler beim Generieren des Exports.';
                        this.cdr.markForCheck();
                    });
                } else {
                    this.errorMessage = err.error?.error ?? 'Fehler beim Generieren des Exports.';
                }
                this.cdr.markForCheck();
            },
        });
    }
}
