import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../../../../shared/components/dialog-shell/dialog-shell.component';
import { TripRegistration } from '../../../domain/trip-registration';
import { RegistrationEditorComponent } from '../registration-editor/registration-editor.component';

export interface RegistrationEditDialogData {
    tileId: string;
    registration: TripRegistration;
}

@Component({
    selector: 'app-registration-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, DialogShellComponent, RegistrationEditorComponent],
    templateUrl: './registration-edit-dialog.component.html',
})
export class RegistrationEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<RegistrationEditDialogComponent>);
    public readonly data = inject<RegistrationEditDialogData>(MAT_DIALOG_DATA);

    get title(): string {
        return this.data.registration.id ? 'Anmeldung bearbeiten' : 'Neue Anmeldung';
    }

    onSaved(): void {
        this.dialogRef.close(true);
    }
}
