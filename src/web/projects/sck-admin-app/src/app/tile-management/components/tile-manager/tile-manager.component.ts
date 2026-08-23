import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
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
    private readonly cdr = inject(ChangeDetectorRef);

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

    // Same nested-HTTP-off-a-router-tracked-source gap as trip-detail.component.ts
    // in sck-app: the outer route.paramMap subscribe is tracked, but this
    // inner getTile() call is its own untracked async boundary under
    // zoneless change detection - without markForCheck() a direct link to
    // /tiles/:id would leave the editor panel blank.
    loadTile(id: string): void {
        this.dataService.getTile(id).subscribe((tile) => {
            this.selectedTile = tile;
            this.cdr.markForCheck();
        });
    }

    onTileSelected(tile: Tile): void {
        this.selectedTile = tile;
        this.isEditorOpen = true;

        // 'tiles' and 'tiles/:id' are two separate route config entries (see
        // app.routes.ts), so navigating between them destroys and recreates
        // this component - fine for an existing tile (loadTile() re-fetches
        // it), fatal for a brand-new draft (TileListComponent.onCreate()'s
        // `id: 'new-...'' placeholder): the fresh instance's ngOnInit sees
        // that id, has no in-memory draft to match it against, and fires a
        // GET for a tile that doesn't exist yet (404, blank editor). Only
        // deep-link real, already-persisted tiles.
        if (!tile.id.startsWith('new-')) {
            this.router.navigate(['event-management', 'tiles', tile.id], {
                queryParamsHandling: 'preserve',
                replaceUrl: true,
            });
        }
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
