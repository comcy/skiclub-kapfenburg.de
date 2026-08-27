import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CollapsibleFiltersComponent } from '../../../shared/components/collapsible-filters/collapsible-filters.component';
import { Member } from '../../domain/member';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';

@Component({
    selector: 'app-member-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        CollapsibleFiltersComponent,
    ],
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

    public displayedColumns: string[] = ['name', 'email', 'status', 'source', 'memberSince', 'honored', 'actions'];

    // Loaded once (list is small enough - see getMembers(1, 1000) below) and
    // filtered/paginated client-side, no reason to round-trip to the API for
    // every keystroke or page click.
    private allMembers: Member[] = [];
    public pagedMembers: Member[] = [];
    public totalFiltered = 0;

    public searchText = '';
    public filterStatus = '';
    public filterSource = '';
    public pageIndex = 0;
    public pageSize = 20;

    private readonly changesSubscription = this.memberChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.refresh());

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.dataService.getMembers(1, 1000).subscribe((response) => {
            this.allMembers = response.items;
            this.pageIndex = 0;
            this.applyFilters();
        });
    }

    onFilterChange(): void {
        this.pageIndex = 0;
        this.applyFilters();
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.applyFilters();
    }

    private applyFilters(): void {
        const search = this.searchText.trim().toLowerCase();
        const filtered = this.allMembers.filter((member) => {
            if (this.filterStatus && member.status !== this.filterStatus) return false;
            if (this.filterSource && member.source !== this.filterSource) return false;
            if (search) {
                const haystack = `${member.firstName} ${member.lastName} ${member.email ?? ''}`.toLowerCase();
                if (!haystack.includes(search)) return false;
            }
            return true;
        });
        this.totalFiltered = filtered.length;
        const start = this.pageIndex * this.pageSize;
        this.pagedMembers = filtered.slice(start, start + this.pageSize);
        this.cdr.markForCheck();
    }

    onEdit(member: Member): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', member.id] } }]);
    }

    onCreate(): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', 'neu'] } }]);
    }
}
