import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AdminUser } from '../../domain/user';
import { UsersDataService } from '../../services/users-data.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
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
