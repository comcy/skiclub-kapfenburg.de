import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CollapsibleFiltersComponent } from '../../../shared/components/collapsible-filters/collapsible-filters.component';
import { SafeDatePipe } from '../../../shared/pipes/safe-date.pipe';
import { Tile } from '../../domain/tile';
import { TileStatus, TileType } from '../../domain/tile-enums';
import { TileChangesService } from '../../services/tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { PageHeadingComponent } from '../../../shared/components/page-heading/page-heading.component';

export type CourseKind = 'sport' | 'ski';

@Component({
    selector: 'app-course-tile-list',
    standalone: true,
    imports: [
        MatCheckboxModule,
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
        SafeDatePipe,
    ],
    templateUrl: './course-tile-list.component.html',
    styleUrls: ['./course-tile-list.component.scss'],
})
export class CourseTileListComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly courseTileChanges = inject(TileChangesService);
    public readonly auth = inject(AuthService);
    private readonly snackBar = inject(MatSnackBar);

    // Set via route `data` (see app.routes.ts's course-management children)
    // - locks this list to Sportkurse (tile.course set) or Ski-/
    // Snowboardkurse (tile.course absent), the discriminator that used to
    // be a checkbox inside one shared course editor.
    public courseKind!: CourseKind;

    public readonly tileStatuses = Object.values(TileStatus);
    public displayedColumns: string[] = ['order', 'title', 'subTitle', 'status', 'behavior', 'date', 'actions'];

    // Loaded once (a ski club's course-tile count is small - same reasoning
    // as member-list.component.ts's getMembers(1, 1000)) and filtered/
    // paginated client-side.
    private allTiles: Tile[] = [];
    public pagedTiles: Tile[] = [];
    public totalFiltered = 0;

    public filterSearch = '';
    public filterStatus = '';
    // Archiv anzeigen: archivierte Kurse statt der aktuellen (Standard).
    public showArchive = false;
    public pageIndex = 0;
    public pageSize = 20;

    private readonly changesSubscription = this.courseTileChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.refresh());

    public get heading(): string {
        return this.courseKind === 'sport' ? 'Sportkurse' : 'Ski-/Snowboardkurse';
    }

    public get createButtonLabel(): string {
        return this.courseKind === 'sport' ? 'Sportkurs erstellen' : 'Ski-/Snowboardkurs erstellen';
    }

    private get editSegment(): string {
        return this.courseKind === 'sport' ? 'sportkurs-bearbeiten' : 'skikurs-bearbeiten';
    }

    ngOnInit(): void {
        this.courseKind = this.route.snapshot.data['courseKind'] as CourseKind;
        this.refresh();
    }

    refresh(): void {
        this.dataService
            .getTiles(1, 1000, undefined, undefined, undefined, TileType.Course, undefined, undefined, this.showArchive)
            .subscribe((response) => {
                this.allTiles = response.items;
                this.pageIndex = 0;
                this.applyFilters();
            });
    }

    onFilterChange(): void {
        this.pageIndex = 0;
        // Archiv-Umschalter laedt neu (anderer Endpunkt), Suche/Status filtern nur clientseitig.
        this.refresh();
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.applyFilters();
    }

    private applyFilters(): void {
        const search = this.filterSearch.trim().toLowerCase();
        const filtered = this.allTiles.filter((tile) => {
            if (!!tile.course !== (this.courseKind === 'sport')) return false;
            if (this.filterStatus && tile.status !== this.filterStatus) return false;
            if (search) {
                const haystack = `${tile.title} ${tile.subTitle}`.toLowerCase();
                if (!haystack.includes(search)) return false;
            }
            return true;
        });
        this.totalFiltered = filtered.length;
        const start = this.pageIndex * this.pageSize;
        this.pagedTiles = filtered.slice(start, start + this.pageSize);
        this.cdr.markForCheck();
    }

    onEdit(tile: Tile): void {
        this.router.navigate([{ outlets: { modal: [this.editSegment, tile.id] } }]);
    }

    onCreate(): void {
        this.router.navigate([{ outlets: { modal: [this.editSegment, 'neu'] } }]);
    }

    onArchive(tile: Tile): void {
        this.dataService.archiveTile(tile.id).subscribe({
            next: () => {
                this.snackBar.open(`„${tile.title}“ archiviert`, 'OK', { duration: 4000 });
                this.refresh();
            },
            error: () => this.snackBar.open('Archivieren fehlgeschlagen', 'OK', { duration: 5000 }),
        });
    }

    onUnarchive(tile: Tile): void {
        this.dataService.unarchiveTile(tile.id).subscribe({
            next: () => {
                this.snackBar.open(`„${tile.title}“ wiederhergestellt`, 'OK', { duration: 4000 });
                this.refresh();
            },
            error: () => this.snackBar.open('Wiederherstellen fehlgeschlagen', 'OK', { duration: 5000 }),
        });
    }

    // Mit Anmeldungen lehnt die API das Loeschen ab (409) - die Meldung nennt dann das Archivieren.
    onDelete(tile: Tile): void {
        this.dataService.deleteTile(tile.id).subscribe({
            next: () => this.refresh(),
            error: (error) =>
                this.snackBar.open(error?.error?.error ?? 'Löschen fehlgeschlagen', 'OK', { duration: 6000 }),
        });
    }
}
