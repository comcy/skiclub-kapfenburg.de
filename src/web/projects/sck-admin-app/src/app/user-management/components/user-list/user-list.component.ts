import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AdminUser } from '../../domain/user';
import { UsersDataService } from '../../services/users-data.service';
import { sortItems } from '../../../shared/utils/sort';
import { PageHeadingComponent } from '../../../shared/components/page-heading/page-heading.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [PageHeadingComponent, CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    private readonly dataService = inject(UsersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    @Output() userSelected = new EventEmitter<AdminUser>();

    public users$!: Observable<AdminUser[]>;
    public displayedColumns: string[] = ['email', 'role', 'lastLogin', 'actions'];

    public sort: Sort = { active: '', direction: '' };
    private readonly accessors = {
        email: (u: AdminUser) => u.email,
        role: (u: AdminUser) => (u.isSuperAdmin ? 'Superadmin' : u.permissions.join(', ')),
        lastLogin: (u: AdminUser) => u.lastLoginAt,
    };

    sorted(users: AdminUser[] | null): AdminUser[] {
        return sortItems(users ?? [], this.sort.active, this.sort.direction, this.accessors);
    }

    onSortChange(sort: Sort): void {
        this.sort = sort;
        this.cdr.markForCheck();
    }

    ngOnInit(): void {
        this.refresh();
    }

    // refresh() is also called from a parent component's async HTTP-save
    // callback (after editing a user's permissions) — under zoneless change
    // detection that callback runs outside any tracked context, so the
    // reassigned users$ needs an explicit markForCheck() to reach the view.
    refresh(): void {
        this.users$ = this.dataService.getUsers();
        this.cdr.markForCheck();
    }

    onEdit(user: AdminUser): void {
        this.userSelected.emit(user);
    }
}
