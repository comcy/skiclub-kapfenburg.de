import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Member } from '../../domain/member';
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
    public readonly auth = inject(AuthService);

    @Output() memberSelected = new EventEmitter<Member>();
    @Output() importRequested = new EventEmitter<void>();

    public members$!: Observable<Member[]>;
    public displayedColumns: string[] = ['name', 'email', 'status', 'source', 'memberSince', 'actions'];

    ngOnInit(): void {
        this.refresh();
    }

    // Zoneless change detection (see app.config.ts) - refresh() is also
    // called from the parent's async save callback, so mark here to cover
    // every call site uniformly (same pattern as user-list/invite-list).
    refresh(): void {
        this.members$ = this.dataService.getMembers(1, 1000).pipe(map((response) => response.items));
        this.cdr.markForCheck();
    }

    onEdit(member: Member): void {
        this.memberSelected.emit(member);
    }

    // Manual entry is the primary intake path for paper-form signups (no
    // online application to promote from) - see the plan's Phase 1 context.
    onCreate(): void {
        this.memberSelected.emit({
            id: '',
            firstName: '',
            lastName: '',
            isFamilyMembership: false,
            status: 'active',
            source: 'manual',
        });
    }
}
