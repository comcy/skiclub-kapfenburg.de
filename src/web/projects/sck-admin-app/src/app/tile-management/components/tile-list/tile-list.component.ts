import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { CollapsibleFiltersComponent } from '../../../shared/components/collapsible-filters/collapsible-filters.component';
import { SafeDatePipe } from '../../../shared/pipes/safe-date.pipe';
import { Tile } from '../../domain/tile';
import { TileKind, TileStatus, TileType } from '../../domain/tile-enums';
import { TileChangesService } from '../../services/tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { PageHeadingComponent } from '../../../shared/components/page-heading/page-heading.component';

@Component({
    selector: 'app-tile-list',
    standalone: true,
    imports: [
        MatCheckboxModule,
        PageHeadingComponent,
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        RouterLink,
        CollapsibleFiltersComponent,
        FormsModule,
        SafeDatePipe,
    ],
    templateUrl: './tile-list.component.html',
    styleUrls: ['./tile-list.component.scss'],
})
export class TileListComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly tileChanges = inject(TileChangesService);
    public readonly auth = inject(AuthService);
    private readonly snackBar = inject(MatSnackBar);

    private readonly changesSubscription = this.tileChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.loadTiles());

    public tiles$!: Observable<Tile[]>;
    public totalItems = 0;
    public pageSize = 10;
    public pageIndex = 0;

    public sortField = 'order';
    public sortDirection: 'asc' | 'desc' = 'asc';
    public filterSearch = '';
    public filterStatus: string = '';
    // Archiv anzeigen: archivierte Tiles statt der aktuellen (Standard).
    public showArchive = false;

    // Reiter im Karten-Management (Route-Data): Ausfahrten / Events / Infos. Kurse laufen im Kurs-Management.
    public readonly kind: TileKind = this.route.snapshot.data['kind'] ?? 'trip';
    public readonly kindLabels: Record<TileKind, { title: string; create: string }> = {
        trip: { title: 'Ausfahrten', create: 'Ausfahrt erstellen' },
        event: { title: 'Events', create: 'Event erstellen' },
        info: { title: 'Infos', create: 'Info erstellen' },
    };
    public readonly tileStatuses = Object.values(TileStatus);

    public displayedColumns: string[] = [
        'order',
        'title',
        'subTitle',
        'status',
        'occupancy',
        'behavior',
        'date',
        'expiration',
        'actions',
    ];

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.pageIndex = params['page'] ? +params['page'] - 1 : 0;
            this.pageSize = params['limit'] ? +params['limit'] : 10;
            this.sortField = params['sort'] || 'order';
            this.sortDirection = params['direction'] || 'asc';
            this.filterSearch = params['search'] || '';
            this.filterStatus = params['status'] || '';
            this.showArchive = params['archive'] === '1';
            this.loadTiles();
        });
        // Belegung gibt es nur bei Ausfahrten.
        if (this.kind !== 'trip') this.displayedColumns = this.displayedColumns.filter((c) => c !== 'occupancy');
    }

    // Zoneless change detection (see app.config.ts) doesn't track a plain
    // HttpClient subscribe callback - loadTiles() is also called from
    // onDelete()'s async callback and from the TileChangesService
    // subscription above (after the aux-routed dialog saves), both outside
    // any tracked context, so mark here to cover every call site uniformly.
    // Füllstand der Ausfahrt: < 70 % grün, ab 70 % gelb, ab 90 % (inkl. voll/überbucht) rot.
    occupancyPercent(tile: Tile): number {
        if (!tile.capacity) return 0;
        return Math.min(100, Math.round(((tile.confirmedRegistrationsCount ?? 0) / tile.capacity) * 100));
    }

    occupancyLevel(tile: Tile): 'ok' | 'warn' | 'full' {
        const ratio = tile.capacity ? (tile.confirmedRegistrationsCount ?? 0) / tile.capacity : 0;
        return ratio >= 0.9 ? 'full' : ratio >= 0.7 ? 'warn' : 'ok';
    }

    loadTiles(): void {
        this.tiles$ = this.dataService
            .getTiles(
                this.pageIndex + 1,
                this.pageSize,
                this.sortField,
                this.sortDirection,
                this.filterSearch,
                this.kind === 'info' ? TileType.Info : TileType.Event,
                this.filterStatus,
                undefined,
                this.showArchive,
                this.kind === 'info' ? undefined : this.kind === 'trip',
            )
            .pipe(
                tap((response) => (this.totalItems = response.total)),
                map((response) => response.items),
            );
        this.cdr.markForCheck();
    }

    onPageChange(event: PageEvent): void {
        this.updateUrl({
            page: event.pageIndex + 1,
            limit: event.pageSize,
        });
    }

    onSortChange(sort: Sort): void {
        this.updateUrl({
            sort: sort.active,
            direction: sort.direction,
        });
    }

    onFilterChange(): void {
        // Reset to first page on filter change
        this.updateUrl({
            page: 1,
            search: this.filterSearch || null,
            status: this.filterStatus || null,
            archive: this.showArchive ? '1' : null,
        });
    }

    private updateUrl(queryParams: Record<string, unknown>): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
        });
    }

    onEdit(tile: Tile): void {
        this.router.navigate([{ outlets: { modal: ['event-bearbeiten', tile.id] } }]);
    }

    onArchive(tile: Tile): void {
        this.dataService.archiveTile(tile.id).subscribe({
            next: () => {
                this.snackBar.open(`„${tile.title}“ archiviert`, 'OK', { duration: 4000 });
                this.loadTiles();
            },
            error: () => this.snackBar.open('Archivieren fehlgeschlagen', 'OK', { duration: 5000 }),
        });
    }

    onUnarchive(tile: Tile): void {
        this.dataService.unarchiveTile(tile.id).subscribe({
            next: () => {
                this.snackBar.open(`„${tile.title}“ wiederhergestellt`, 'OK', { duration: 4000 });
                this.loadTiles();
            },
            error: () => this.snackBar.open('Wiederherstellen fehlgeschlagen', 'OK', { duration: 5000 }),
        });
    }

    // Mit Anmeldungen lehnt die API das Loeschen ab (409) - die Meldung nennt dann das Archivieren.
    onDelete(tile: Tile): void {
        this.dataService.deleteTile(tile.id).subscribe({
            next: () => this.loadTiles(),
            error: (error) =>
                this.snackBar.open(error?.error?.error ?? 'Löschen fehlgeschlagen', 'OK', { duration: 6000 }),
        });
    }

    onCreate(): void {
        this.router.navigate([{ outlets: { modal: ['event-bearbeiten', 'neu', { kind: this.kind }] } }]);
    }
}
