import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { InviteEditorComponent } from '../invite-editor/invite-editor.component';

@Component({
    selector: 'app-invite-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, DialogShellComponent, InviteEditorComponent],
    templateUrl: './invite-edit-dialog.component.html',
})
export class InviteEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<InviteEditDialogComponent>);

    onSaved(): void {
        this.dialogRef.close(true);
    }
}
