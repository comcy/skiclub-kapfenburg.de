/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, EventEmitter, OnInit, Output, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogComponent } from 'projects/shared-lib/src/lib/components/dialogs/base-dialog/base-dialog.component';
import { MembershipRegistrationFormComponent } from '../../ui/membership-registration-form/membership-registration-form.component';
import { MembershipDialogData } from './membership-register-dialog.interfaces';

@Component({
    selector: 'lib-membership-register-dialog',
    templateUrl: './membership-register-dialog.component.html',
    styleUrls: ['./membership-register-dialog.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BaseDialogComponent, MembershipRegistrationFormComponent],
})
export class MembershipRegisterDialogComponent implements OnInit {
    @Output() public handleConfirmClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    public dialogTitle!: string;
    public data = inject<MembershipDialogData>(MAT_DIALOG_DATA);

    private dialogRef = inject<MatDialogRef<MembershipRegisterDialogComponent>>(MatDialogRef);

    ngOnInit(): void {
        this.dialogTitle = `${this.data.tile.title}`;
    }

    public onMembershipRegistrationFormSubmit(success: boolean): void {
        if (success) {
            this.handleConfirmClicked.emit(true);
            this.dialogRef.close();
        }
    }
}
