import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TileListComponent } from '../tile-list/tile-list.component';
import { TileEditorComponent } from '../tile-editor/tile-editor.component';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-tile-manager',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, TileListComponent, TileEditorComponent],
    templateUrl: './tile-manager.component.html',
    styleUrls: ['./tile-manager.component.scss'],
})
export class TileManagerComponent implements OnInit {
    public selectedTile: Tile | null = null;
    public isEditorOpen = false;

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
                this.isEditorOpen = true;
            } else {
                // Select first tile if no ID is present
                // But don't open editor automatically unless you want to?
                // User said "einblenden wenn man ein item aus der liste editieren möchte".
                // So maybe don't select first tile automatically? Or select it but keep editor closed?
                // Let's select it but keep editor closed, OR just don't select.
                // If I select it, `selectedTile` is set.
                // If `isEditorOpen` is false, editor is hidden.
                // Let's NOT select first tile automatically for now, to support "Empty" state.
                // this.selectFirstTile();
            }
        });
    }

    loadTile(id: string): void {
        this.dataService.getTile(id).subscribe((tile) => {
            this.selectedTile = tile;
        });
    }

    onTileSelected(tile: Tile): void {
        this.selectedTile = tile;
        this.isEditorOpen = true;

        // Update URL without reloading, preserving query params
        this.router.navigate(['event-management', 'tiles', tile.id], {
            queryParamsHandling: 'preserve',
            replaceUrl: true,
        });
    }

    onTileSaved(): void {
        this.tileList.loadTiles();
        // Keep editor open or close? Usually keep open to see result.
    }

    closeEditor(): void {
        this.isEditorOpen = false;
        // Optionally clear selection in URL?
        this.router.navigate(['event-management', 'tiles'], {
            queryParamsHandling: 'preserve',
            replaceUrl: true,
        });
        // Clear selected tile logic if needed, but keeping it is fine.
    }
}
