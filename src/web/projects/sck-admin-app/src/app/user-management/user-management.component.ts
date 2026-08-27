import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { InviteListComponent } from './components/invite-list/invite-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserPermissionsEditorComponent } from './components/user-permissions-editor/user-permissions-editor.component';
import { AdminUser } from './domain/user';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [UserListComponent, UserPermissionsEditorComponent, InviteListComponent],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
    public readonly auth = inject(AuthService);
    private readonly cdr = inject(ChangeDetectorRef);

    selectedUser: AdminUser | null = null;

    onUserSelected(user: AdminUser): void {
        // Clone to avoid mutating the list's row directly before save.
        this.selectedUser = { ...user };
    }

    // Runs from a child's async HTTP-save callback — under zoneless change
    // detection that's outside any tracked context, so closing the editor
    // panel needs an explicit markForCheck() to reach this view.
    onPermissionsSaved(userList: UserListComponent): void {
        this.selectedUser = null;
        this.cdr.markForCheck();
        userList.refresh();
    }
}
