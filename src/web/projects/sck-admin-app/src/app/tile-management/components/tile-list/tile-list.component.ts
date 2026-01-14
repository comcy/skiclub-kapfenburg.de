import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-tile-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
    ],
    templateUrl: './tile-list.component.html',
    styleUrls: ['./tile-list.component.scss'],
})
export class TileListComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    @Output() tileSelected = new EventEmitter<Tile>();
    @Input() selectedTileId: string | undefined;

    public tiles$!: Observable<Tile[]>;
    public totalItems = 0;
    public pageSize = 10;
    public pageIndex = 0;

    public sortField = 'order';
    public sortDirection: 'asc' | 'desc' = 'asc';
    public filterSearch = '';
    public filterType: string = '';
    public filterStatus: string = '';

    public readonly tileTypes = Object.values(TileType);
    public readonly tileStatuses = Object.values(TileStatus);

    public displayedColumns: string[] = [
        'order',
        'title',
        'subTitle',
        'type',
        'status',
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
            this.filterType = params['type'] || '';
            this.filterStatus = params['status'] || '';
            this.loadTiles();
        });
    }

    loadTiles(): void {
        this.tiles$ = this.dataService
            .getTiles(
                this.pageIndex + 1,
                this.pageSize,
                this.sortField,
                this.sortDirection,
                this.filterSearch,
                this.filterType,
                this.filterStatus,
            )
            .pipe(
                tap((response) => (this.totalItems = response.total)),
                map((response) => response.items),
            );
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
            type: this.filterType || null,
            status: this.filterStatus || null,
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
        this.tileSelected.emit(tile);
    }

    onDelete(tile: Tile): void {
        this.dataService.deleteTile(tile.id).subscribe(() => {
            this.loadTiles();
        });
    }

    onCreate(): void {
        const newTile: Tile = {
            id: `new-${Date.now()}`,
            order: 0,
            type: TileType.Info,
            title: 'New Tile',
            date: new Date().toISOString(),
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: TileStatus.Open,
            expiration: new Date().toISOString(),
            behavior: TileBehavior.View,
            visible: true,
        };
        this.tileSelected.emit(newTile);
    }
}
