import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-tile-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule],
    templateUrl: './tile-list.component.html',
    styleUrls: ['./tile-list.component.scss'],
})
export class TileListComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);

    @Output() tileSelected = new EventEmitter<Tile>();
    @Input() selectedTileId: string | undefined;

    public tiles$!: Observable<Tile[]>;
    public totalItems = 0;
    public pageSize = 10;
    public pageIndex = 0;

    public displayedColumns: string[] = ['title', 'type', 'date', 'expiration', 'actions'];

    ngOnInit(): void {
        this.loadTiles();
    }

    loadTiles(): void {
        this.tiles$ = this.dataService.getTiles(this.pageIndex + 1, this.pageSize).pipe(
            tap((response) => (this.totalItems = response.total)),
            map((response) => response.items),
        );
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadTiles();
    }

    onEdit(tile: Tile): void {
        // ...
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
