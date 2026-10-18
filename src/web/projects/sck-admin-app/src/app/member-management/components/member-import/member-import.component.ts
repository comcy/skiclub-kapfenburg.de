import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MemberCreationParams } from '../../domain/member';
import { MemberImportApplyResult, MemberImportCollision, MemberImportPreview } from '../../domain/member-import';
import { MembersDataService } from '../../services/members-data.service';

type ImportStep = 'upload' | 'preview' | 'done';

// One row per differing field, tracked by "<memberId>:<field>" - a Map
// keeps this flat rather than nesting per-collision state, since only the
// entries an admin actually touches (chose "neuen Wert übernehmen") need to
// exist at all; everything else defaults to "bestehend behalten".
type ChosenKey = `${string}:${string}`;

@Component({
    selector: 'app-member-import',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatButtonToggleModule, MatIconModule],
    templateUrl: './member-import.component.html',
    styleUrls: ['./member-import.component.scss'],
})
export class MemberImportComponent {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Output() imported = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    public step: ImportStep = 'upload';
    public isLoading = false;
    public error: string | null = null;
    public preview: MemberImportPreview | null = null;
    public applyResult: MemberImportApplyResult | null = null;

    private readonly chosenFields = new Set<ChosenKey>();

    onUploadClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        target.value = '';
        if (!file) return;

        this.isLoading = true;
        this.error = null;
        this.dataService.previewMembersImport(file).subscribe({
            next: (preview) => {
                this.preview = preview;
                this.step = 'preview';
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.error = err?.error?.error ?? 'Import-Vorschau fehlgeschlagen.';
                this.isLoading = false;
                this.cdr.markForCheck();
            },
        });
    }

    isTakingIncoming(memberId: string, field: string): boolean {
        return this.chosenFields.has(`${memberId}:${field}`);
    }

    chooseExisting(memberId: string, field: string): void {
        this.chosenFields.delete(`${memberId}:${field}`);
    }

    chooseIncoming(memberId: string, field: string): void {
        this.chosenFields.add(`${memberId}:${field}`);
    }

    onApply(): void {
        if (!this.preview) return;

        const overridesByMember = new Map<string, Partial<MemberCreationParams>>();
        for (const collision of this.preview.kollisionen) {
            for (const diff of collision.diffFields) {
                if (!this.isTakingIncoming(collision.memberId, diff.field)) continue;
                const fields = overridesByMember.get(collision.memberId) ?? {};
                (fields as Record<string, unknown>)[diff.field] = diff.incoming;
                overridesByMember.set(collision.memberId, fields);
            }
        }
        const collisionOverrides = Array.from(overridesByMember, ([memberId, fields]) => ({ memberId, fields }));

        this.isLoading = true;
        this.error = null;
        this.dataService.applyMembersImport(this.preview.importId, collisionOverrides).subscribe({
            next: (result) => {
                this.applyResult = result;
                this.step = 'done';
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.error = err?.error?.error ?? 'Import fehlgeschlagen.';
                this.isLoading = false;
                this.cdr.markForCheck();
            },
        });
    }

    memberName(collision: MemberImportCollision): string {
        return `${collision.existing.firstName} ${collision.existing.lastName}`;
    }

    formatValue(value: unknown): string {
        if (value === undefined || value === null || value === '') return '–';
        return String(value);
    }
}
