import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Permission } from '../../../auth/domain/session';
import { AdminUser } from '../../domain/user';
import { UsersDataService } from '../../services/users-data.service';

const PERMISSION_OPTIONS: { value: Permission; label: string }[] = [
    { value: 'tiles:write', label: 'Ausfahrten/Tiles bearbeiten' },
    { value: 'boardings:write', label: 'Fahrgemeinschaften bearbeiten' },
    { value: 'users:manage', label: 'Nutzer verwalten' },
    { value: 'members:manage', label: 'Mitglieder verwalten' },
    { value: 'sepa:export', label: 'SEPA-Beitragseinzug exportieren' },
];

@Component({
    selector: 'app-user-permissions-editor',
    standalone: true,
    imports: [FormsModule, MatCheckboxModule, MatButtonModule],
    templateUrl: './user-permissions-editor.component.html',
    styleUrls: ['./user-permissions-editor.component.scss'],
})
export class UserPermissionsEditorComponent implements OnChanges {
    @Input() user: AdminUser | null = null;
    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly dataService = inject(UsersDataService);

    public readonly options = PERMISSION_OPTIONS;
    public checked: Record<Permission, boolean> = {
        'tiles:write': false,
        'boardings:write': false,
        'users:manage': false,
        'members:manage': false,
        'sepa:export': false,
    };

    ngOnChanges(): void {
        this.checked = {
            'tiles:write': !!this.user?.permissions.includes('tiles:write'),
            'boardings:write': !!this.user?.permissions.includes('boardings:write'),
            'users:manage': !!this.user?.permissions.includes('users:manage'),
            'members:manage': !!this.user?.permissions.includes('members:manage'),
            'sepa:export': !!this.user?.permissions.includes('sepa:export'),
        };
    }

    onSave(): void {
        if (!this.user) return;

        const permissions = this.options.filter((option) => this.checked[option.value]).map((option) => option.value);
        this.dataService.updateUserPermissions(this.user.id, permissions).subscribe(() => this.saved.emit());
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}
