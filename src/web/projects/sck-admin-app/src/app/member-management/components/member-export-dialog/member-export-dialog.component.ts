import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { Member } from '../../domain/member';
import {
    ExportFormat,
    ExportGroup,
    MEMBER_EXPORT_FIELDS,
    buildMemberExport,
    defaultExportKeys,
} from '../../domain/member-export';

export interface MemberExportScope {
    label: string;
    members: Member[];
}

export interface MemberExportDialogData {
    title: string;
    // Ein Eintrag = Einzelexport (eine Zeile der Liste); mehrere = Mitgliederliste mit Auswahl.
    scopes: MemberExportScope[];
    // Einzelexport startet als Text-Block, Listenexport als Tabelle.
    format: ExportFormat;
}

const GROUPS: ExportGroup[] = ['Stammdaten', 'Kontakt', 'Mitgliedschaft', 'Bankdaten'];

// Export als Klartext zum Kopieren (z. B. per Mail an den Kassierer) oder als Datei.
// Bankdaten sind bewusst nie vorausgewaehlt.
@Component({
    selector: 'app-member-export-dialog',
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        DialogShellComponent,
    ],
    templateUrl: './member-export-dialog.component.html',
    styleUrls: ['./member-export-dialog.component.scss'],
})
export class MemberExportDialogComponent {
    public readonly data = inject<MemberExportDialogData>(MAT_DIALOG_DATA);
    private readonly snackBar = inject(MatSnackBar);

    public readonly isList = this.data.scopes.length > 1;
    public readonly groups = GROUPS.map((group) => ({
        group,
        fields: MEMBER_EXPORT_FIELDS.filter((f) => f.group === group),
    }));

    public readonly scopeIndex = signal(0);
    public readonly format = signal<ExportFormat>(this.data.format);
    public readonly withHeader = signal(true);
    public readonly keys = signal<string[]>(defaultExportKeys());

    public readonly members = computed(() => this.data.scopes[this.scopeIndex()].members);
    public readonly output = computed(() =>
        buildMemberExport(this.members(), this.keys(), this.format(), this.withHeader()),
    );
    public readonly includesBank = computed(() =>
        MEMBER_EXPORT_FIELDS.some((f) => f.group === 'Bankdaten' && this.keys().includes(f.key)),
    );

    isOn(key: string): boolean {
        return this.keys().includes(key);
    }

    toggle(key: string, on: boolean): void {
        this.keys.update((keys) => (on ? [...keys, key] : keys.filter((k) => k !== key)));
    }

    async copy(): Promise<void> {
        await navigator.clipboard.writeText(this.output());
        this.snackBar.open('In die Zwischenablage kopiert', 'OK', { duration: 3000 });
    }

    download(): void {
        const csv = this.format() === 'csv';
        // BOM, damit Excel UTF-8 (Umlaute) in CSV erkennt.
        const blob = new Blob([csv ? '﻿' + this.output() : this.output()], {
            type: csv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mitglieder-${new Date().toISOString().slice(0, 10)}.${csv ? 'csv' : 'txt'}`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
