import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Member } from '../../domain/member';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';

@Component({
    selector: 'app-member-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);
    private readonly memberChanges = inject(MemberChangesService);
    public readonly auth = inject(AuthService);

    @Output() importRequested = new EventEmitter<void>();

    public members$!: Observable<Member[]>;
    public displayedColumns: string[] = ['name', 'email', 'status', 'source', 'memberSince', 'honored', 'actions'];

    // takeUntilDestroyed() needs an injection context (constructor/field
    // initializer) - it throws NG0203 if called inside ngOnInit(), which
    // silently skips the whole subscription (the error is thrown, but
    // nothing surfaces it to the user - the list would just never refresh).
    private readonly changesSubscription = this.memberChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.refresh());

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.members$ = this.dataService.getMembers(1, 1000).pipe(map((response) => response.items));
        this.cdr.markForCheck();
    }

    onEdit(member: Member): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', member.id] } }]);
    }

    // Manual entry is the primary intake path for paper-form signups (no
    // online application to promote from) - see the plan's Phase 1 context.
    onCreate(): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', 'neu'] } }]);
    }
}
