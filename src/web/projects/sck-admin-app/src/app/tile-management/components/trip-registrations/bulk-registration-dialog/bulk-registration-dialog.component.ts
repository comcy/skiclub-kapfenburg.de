import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { concatMap, from, toArray } from 'rxjs';
import { Boarding } from '../../../../boardings-management/domain/boarding';
import { BoardingsDataService } from '../../../../boardings-management/services/boardings-data.service';
import { DialogShellComponent } from '../../../../shared/components/dialog-shell/dialog-shell.component';
import { parseRegistrationList, ParsedListRow } from '../../../domain/parse-registration-list';
import { RegistrationAgeCategory, RegistrationStatus, TripRegistration } from '../../../domain/trip-registration';
import { TilesDataService } from '../../../services/tiles-data.service';

export interface BulkRegistrationDialogData {
    tileId: string;
    existing: TripRegistration[];
}

interface PreviewRow extends ParsedListRow {
    duplicate: boolean;
    member?: boolean;
}

const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ');

// "Mehrere hinzufügen": eine ganze Teilnehmerliste aus dem Sheet einfügen, Vorschau prüfen, auf einmal anlegen.
// Bereits angemeldete Personen (gleicher Vor- und Nachname) werden übersprungen, damit ein zweites Einfügen
// nichts doppelt anlegt. Es werden keine Bestätigungsmails verschickt (wie bei der manuellen Einzelanlage).
@Component({
    selector: 'app-bulk-registration-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        TextFieldModule,
        DialogShellComponent,
    ],
    templateUrl: './bulk-registration-dialog.component.html',
    styleUrls: ['./bulk-registration-dialog.component.scss'],
})
export class BulkRegistrationDialogComponent implements OnInit {
    public readonly dialogRef = inject(MatDialogRef<BulkRegistrationDialogComponent>);
    public readonly data = inject<BulkRegistrationDialogData>(MAT_DIALOG_DATA);
    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public text = '';
    public status: RegistrationStatus = 'confirmed';
    public rows: PreviewRow[] = [];
    public ignored = 0;
    public saving = false;
    public error = '';
    private boardings: Boarding[] = [];

    public readonly ageLabels: Record<RegistrationAgeCategory, string> = {
        adult: 'Erwachsen',
        youthUntil16: 'Jugend',
        childUntil6: 'Kind',
    };

    ngOnInit(): void {
        this.boardingsService.getBoardings(1, 1000).subscribe((response) => {
            this.boardings = response.items;
            this.onTextChange();
        });
    }

    get newRows(): PreviewRow[] {
        return this.rows.filter((row) => !row.duplicate);
    }

    boardingName(id: string | undefined): string {
        return this.boardings.find((b) => b.id === id)?.name ?? '–';
    }

    onTextChange(): void {
        const existing = new Set(this.data.existing.map((r) => normalize(`${r.firstName} ${r.lastName}`)));
        const seen = new Set<string>();
        const parsed = parseRegistrationList(this.text, this.boardings);
        this.ignored = parsed.ignored;
        this.rows = parsed.rows.map((row) => {
            const key = normalize(`${row.firstName} ${row.lastName}`);
            const duplicate = existing.has(key) || seen.has(key);
            seen.add(key);
            return { ...row, duplicate };
        });
        this.cdr.markForCheck();
        // Mitglieder-Erkennung (Name; vom Server, gleiche Regeln wie beim Anlegen) für die Vorschau.
        const requested = this.rows;
        if (!requested.length) return;
        this.dataService
            .matchMembers(requested.map((r) => ({ firstName: r.firstName, lastName: r.lastName })))
            .subscribe((matches) => {
                if (this.rows !== requested) return; // Text hat sich inzwischen geändert
                requested.forEach((row, i) => (row.member = matches[i]));
                this.cdr.markForCheck();
            });
    }

    onCreate(): void {
        if (this.saving || !this.newRows.length) return;
        this.saving = true;
        this.error = '';
        from(this.newRows)
            .pipe(
                concatMap((row, index) =>
                    this.dataService.createRegistration(this.data.tileId, {
                        firstName: row.firstName,
                        lastName: row.lastName,
                        phone: row.phone,
                        boardingId: row.boardingId,
                        ageCategory: row.ageCategory,
                        isMember: false,
                        status: this.status,
                        source: 'manual',
                        notes: row.notes,
                        orderIndex: index,
                        transferredToExternalList: false,
                        busOnly: false,
                        snowshoes: false,
                        courseRequested: !!row.sportType,
                        sportType: row.sportType,
                    }),
                ),
                toArray(),
            )
            .subscribe({
                next: () => this.dialogRef.close(true),
                error: () => {
                    // Teilweise angelegt: Liste im Hintergrund aktualisieren, Duplikat-Erkennung schützt vor Doppelten.
                    this.saving = false;
                    this.error =
                        'Anlegen unterbrochen - bitte Liste prüfen und den Rest erneut einfügen (bereits angelegte werden übersprungen).';
                    this.cdr.markForCheck();
                },
            });
    }
}
