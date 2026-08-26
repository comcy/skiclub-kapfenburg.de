import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Member } from '../../domain/member';
import { MemberEditorComponent } from '../member-editor/member-editor.component';

export interface MemberEditDialogData {
    member: Member;
}

@Component({
    selector: 'app-member-edit-dialog',
    standalone: true,
    imports: [MatDialogModule, MemberEditorComponent],
    templateUrl: './member-edit-dialog.component.html',
})
export class MemberEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<MemberEditDialogComponent>);
    public readonly data = inject<MemberEditDialogData>(MAT_DIALOG_DATA);

    onSaved(): void {
        // true = "something changed, refresh the lists" - read by
        // MemberEditRoutingDialogComponent's afterClosed() handler.
        this.dialogRef.close(true);
    }
}
