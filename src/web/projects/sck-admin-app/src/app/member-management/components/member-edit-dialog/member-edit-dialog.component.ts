import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { Member } from '../../domain/member';
import { MemberEditorComponent } from '../member-editor/member-editor.component';

export interface MemberEditDialogData {
    member: Member;
}

@Component({
    selector: 'app-member-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, DialogShellComponent, MemberEditorComponent],
    templateUrl: './member-edit-dialog.component.html',
})
export class MemberEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<MemberEditDialogComponent>);
    public readonly data = inject<MemberEditDialogData>(MAT_DIALOG_DATA);
    public readonly auth = inject(AuthService);

    get title(): string {
        return this.data.member.id ? 'Mitglied bearbeiten' : 'Mitglied anlegen';
    }

    onSaved(): void {
        // true = "something changed, refresh the lists" - read by
        // MemberEditRoutingDialogComponent's afterClosed() handler.
        this.dialogRef.close(true);
    }
}
