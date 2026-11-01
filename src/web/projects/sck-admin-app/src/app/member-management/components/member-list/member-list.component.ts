import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CollapsibleFiltersComponent } from '../../../shared/components/collapsible-filters/collapsible-filters.component';
import { MemberAgeAlerts, memberAgeAlerts } from '../../domain/member-age';
import { Member } from '../../domain/member';
import {
    MemberExportDialogComponent,
    MemberExportDialogData,
} from '../member-export-dialog/member-export-dialog.component';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';
import { PageHeadingComponent } from '../../../shared/components/page-heading/page-heading.component';

@Component({
    selector: 'app-member-list',
    standalone: true,
    imports: [
        PageHeadingComponent,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTooltipModule,
        CollapsibleFiltersComponent,
    ],
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly memberChanges = inject(MemberChangesService);
    public readonly auth = inject(AuthService);

    @Output() importRequested = new EventEmitter<void>();

    public displayedColumns: string[] = ['name', 'email', 'status', 'source', 'memberSince', 'honored', 'actions'];

    // Loaded once (list is small enough - see getMembers(1, 1000) below) and
    // filtered/paginated client-side, no reason to round-trip to the API for
    // every keystroke or page click.
    // Zeilen-Info pro Mitglied: Familien-Kind (eingerückt unter dem Hauptanmelder), Block-Index für die Färbung.
    private rowInfo = new Map<string, { child: boolean; block: number; head?: Member }>();

    isFamilyChild(member: Member): boolean {
        return this.rowInfo.get(member.id)?.child ?? false;
    }

    // Jede Familie (und jedes Einzelmitglied) ist ein Block; jeder zweite Block ist dezent getönt.
    isTintedBlock(member: Member): boolean {
        return (this.rowInfo.get(member.id)?.block ?? 0) % 2 === 1;
    }

    familyHeadName(member: Member): string {
        const head = this.rowInfo.get(member.id)?.head;
        return head ? `${head.firstName} ${head.lastName}` : '';
    }

    // Hauptanmelder: wer eine E-Mail hat, dann länger Mitglied, dann älter, dann alphabetisch.
    private static headOrder = (a: Member, b: Member): number =>
        Number(!!b.email) - Number(!!a.email) ||
        (a.memberSince ?? '9999').localeCompare(b.memberSince ?? '9999') ||
        (a.birthday ?? '9999').localeCompare(b.birthday ?? '9999') ||
        `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);

    // Familien zusammenziehen: Hauptanmelder zuerst, die übrigen direkt darunter. Eine Familie steht dort, wo ihr
    // erstes (gefiltertes) Mitglied vorkommt; Einzelmitglieder bleiben in ihrer Reihenfolge.
    private groupFamilies(members: Member[]): Member[] {
        const byGroup = new Map<string, Member[]>();
        for (const m of members) {
            if (m.familyGroupId) byGroup.set(m.familyGroupId, [...(byGroup.get(m.familyGroupId) ?? []), m]);
        }
        const placed = new Set<string>();
        const result: Member[] = [];
        this.rowInfo = new Map();
        let block = 0;
        for (const m of members) {
            const group = m.familyGroupId ? byGroup.get(m.familyGroupId)! : undefined;
            if (!group || group.length < 2) {
                this.rowInfo.set(m.id, { child: false, block: block++ });
                result.push(m);
                continue;
            }
            if (placed.has(m.familyGroupId!)) continue;
            placed.add(m.familyGroupId!);
            const [head, ...children] = [...group].sort(MemberListComponent.headOrder);
            this.rowInfo.set(head.id, { child: false, block });
            result.push(head);
            for (const child of children) {
                this.rowInfo.set(child.id, { child: true, block, head });
                result.push(child);
            }
            block++;
        }
        return result;
    }

    // Weitere Mitglieder derselben Familiengruppe (Namen), '' wenn keine/nicht zugeordnet.
    familyOthers(member: Member): string {
        if (!member.familyGroupId) return '';
        return this.allMembers
            .filter((m) => m.familyGroupId === member.familyGroupId && m.id !== member.id)
            .map((m) => `${m.firstName} ${m.lastName}`)
            .join(', ');
    }

    public alerts: MemberAgeAlerts = { overdue: [], soon: [], missingBirthday: [] };
    public filterBirthday = '';

    private allMembers: Member[] = [];
    private filteredMembers: Member[] = [];
    public pagedMembers: Member[] = [];
    public totalFiltered = 0;

    public searchText = '';
    public filterStatus = '';
    public filterSource = '';
    public filterTeam = '';
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
            this.alerts = memberAgeAlerts(this.allMembers);
            this.pageIndex = 0;
            this.applyFilters();
        });
    }

    onFilterChange(): void {
        this.pageIndex = 0;
        this.applyFilters();
    }

    // Hinweis-Banner -> Liste auf die betroffenen Mitglieder einschränken.
    showOnly(filter: 'missing' | 'adult18'): void {
        this.filterBirthday = filter;
        this.onFilterChange();
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
            if (this.filterTeam && !member.isTeachingTeam) return false;
            if (this.filterBirthday === 'missing' && (member.birthday || member.status !== 'active')) return false;
            if (this.filterBirthday === 'adult18' && !this.alerts.overdue.includes(member)) return false;
            if (search) {
                const haystack = `${member.firstName} ${member.lastName} ${member.email ?? ''}`.toLowerCase();
                if (!haystack.includes(search)) return false;
            }
            return true;
        });
        this.filteredMembers = this.groupFamilies(filtered);
        this.totalFiltered = filtered.length;
        const start = this.pageIndex * this.pageSize;
        this.pagedMembers = this.filteredMembers.slice(start, start + this.pageSize);
        this.cdr.markForCheck();
    }

    // Einzelexport einer Zeile: Klartext zum Kopieren (z. B. fuer den Kassierer).
    onExportMember(member: Member): void {
        this.dialog.open<MemberExportDialogComponent, MemberExportDialogData>(MemberExportDialogComponent, {
            data: {
                title: `Daten exportieren: ${member.firstName} ${member.lastName}`,
                scopes: [{ label: 'Mitglied', members: [member] }],
                format: 'text',
            },
            maxWidth: '95vw',
        });
    }

    // Listenexport mit Auswahl: aktuelle Filterung, alle aktiven oder alle Mitglieder.
    onExportList(): void {
        this.dialog.open<MemberExportDialogComponent, MemberExportDialogData>(MemberExportDialogComponent, {
            data: {
                title: 'Mitgliederliste exportieren',
                scopes: [
                    { label: 'Aktuelle Filterung', members: this.filteredMembers },
                    { label: 'Alle aktiven', members: this.allMembers.filter((m) => m.status === 'active') },
                    { label: 'Alle Mitglieder', members: this.allMembers },
                ],
                format: 'tsv',
            },
            maxWidth: '95vw',
        });
    }

    onToggleTeachingTeam(member: Member): void {
        this.dataService.setTeachingTeam(member, !member.isTeachingTeam).subscribe((updated) => {
            this.allMembers = this.allMembers.map((m) => (m.id === updated.id ? updated : m));
            this.applyFilters();
        });
    }

    onEdit(member: Member): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', member.id] } }]);
    }

    onDelete(member: Member): void {
        const name = `${member.firstName} ${member.lastName}`;
        if (
            !confirm(
                `${name} endgültig löschen?\n\nDas kann nicht rückgängig gemacht werden. Bestehende Anmeldungen bleiben erhalten, verlieren aber die Mitglieder-Verknüpfung. Zum Ausblenden besser den Status auf „inaktiv“ setzen.`,
            )
        )
            return;
        this.dataService.deleteMember(member.id).subscribe(() => {
            this.allMembers = this.allMembers.filter((m) => m.id !== member.id);
            this.applyFilters();
        });
    }

    onCreate(): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', 'neu'] } }]);
    }
}
