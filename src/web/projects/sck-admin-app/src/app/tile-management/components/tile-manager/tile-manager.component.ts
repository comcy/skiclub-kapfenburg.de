import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TileListComponent } from '../tile-list/tile-list.component';
import { TileEditorComponent } from '../tile-editor/tile-editor.component';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-tile-manager',
    standalone: true,
    imports: [CommonModule, TileListComponent, TileEditorComponent],
    templateUrl: './tile-manager.component.html',
    styleUrls: ['./tile-manager.component.scss'],
})
export class TileManagerComponent implements OnInit {
    public selectedTile: Tile | null = null;
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly dataService = inject(TilesDataService);

    @ViewChild(TileListComponent) tileList!: TileListComponent;

    ngOnInit(): void {
        // Check for ID parameter
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (id) {
                if (this.selectedTile?.id === id) {
                    return;
                }
                this.loadTile(id);
            } else {
                // Select first tile if no ID is present
                this.selectFirstTile();
            }
        });
    }

    loadTile(id: string): void {
        this.dataService.getTile(id).subscribe((tile) => {
            this.selectedTile = tile;
        });
    }

    selectFirstTile(): void {
        this.dataService.getTiles().subscribe((response) => {
            if (response.items.length > 0) {
                this.onTileSelected(response.items[0]);
            }
        });
    }

    onTileSelected(tile: Tile): void {
        this.selectedTile = tile;
        // Update URL without reloading
        this.router.navigate(['event-management', 'tiles', tile.id], { replaceUrl: true });
    }

    onTileSaved(): void {
        this.tileList.loadTiles();
    }
}
