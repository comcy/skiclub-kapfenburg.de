import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersDataService } from '../../services/users-data.service';

@Component({
    selector: 'app-invite-editor',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './invite-editor.component.html',
    styleUrls: ['./invite-editor.component.scss'],
})
export class InviteEditorComponent {
    @Output() saved = new EventEmitter<void>();

    private readonly dataService = inject(UsersDataService);

    public email = '';

    // Read by the dialog's own "Einladen" button (outside this component,
    // in the dialog shell's sticky actions area).
    get canSave(): boolean {
        return !!this.email;
    }

    onSave(): void {
        if (!this.email) return;

        this.dataService.createInvite(this.email).subscribe(() => {
            this.email = '';
            this.saved.emit();
        });
    }
}
