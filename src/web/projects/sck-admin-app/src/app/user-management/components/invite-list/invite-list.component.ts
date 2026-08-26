import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Invite } from '../../domain/invite';
import { UsersDataService } from '../../services/users-data.service';
import { InviteEditDialogComponent } from '../invite-edit-dialog/invite-edit-dialog.component';

@Component({
    selector: 'app-invite-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
    templateUrl: './invite-list.component.html',
    styleUrls: ['./invite-list.component.scss'],
})
export class InviteListComponent implements OnInit {
    private readonly dataService = inject(UsersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly dialog = inject(MatDialog);
    public readonly auth = inject(AuthService);

    public invites$!: Observable<Invite[]>;
    public displayedColumns: string[] = ['email', 'createdAt', 'expiresAt', 'status'];

    ngOnInit(): void {
        this.refresh();
    }

    // refresh() is also called from a parent component's async HTTP-save
    // callback (after creating an invite) — under zoneless change detection
    // that callback runs outside any tracked context, so the reassigned
    // invites$ needs an explicit markForCheck() to reach the view.
    refresh(): void {
        this.invites$ = this.dataService.getInvites();
        this.cdr.markForCheck();
    }

    status(invite: Invite): 'accepted' | 'expired' | 'pending' {
        if (invite.acceptedAt) return 'accepted';
        if (new Date(invite.expiresAt).getTime() < Date.now()) return 'expired';
        return 'pending';
    }

    onCreate(): void {
        const dialogRef = this.dialog.open(InviteEditDialogComponent, { width: '480px', maxWidth: '95vw' });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.refresh();
        });
    }
}
