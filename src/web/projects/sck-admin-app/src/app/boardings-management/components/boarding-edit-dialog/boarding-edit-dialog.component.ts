import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { Boarding } from '../../domain/boarding';
import { BoardingEditorComponent } from '../boarding-editor/boarding-editor.component';

export interface BoardingEditDialogData {
    boarding: Boarding;
}

@Component({
    selector: 'app-boarding-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, DialogShellComponent, BoardingEditorComponent],
    templateUrl: './boarding-edit-dialog.component.html',
})
export class BoardingEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<BoardingEditDialogComponent>);
    public readonly data = inject<BoardingEditDialogData>(MAT_DIALOG_DATA);

    get title(): string {
        return this.data.boarding.id ? 'Boarding bearbeiten' : 'Boarding anlegen';
    }

    onSaved(): void {
        this.dialogRef.close(true);
    }
}
