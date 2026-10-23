import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileKind, TileStatus, TileType, tileKindOf } from '../../domain/tile-enums';
import { TileChangesService } from '../../services/tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { EventTileEditDialogComponent } from '../event-tile-edit-dialog/event-tile-edit-dialog.component';

const buildBlankTile = (kind: TileKind): Tile => ({
    id: `new-${Date.now()}`,
    order: 0,
    type: kind === 'info' ? TileType.Info : TileType.Event,
    title: '',
    date: new Date().toISOString(),
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    status: TileStatus.Open,
    expiration: new Date().toISOString(),
    behavior: TileBehavior.View,
    visible: true,
});

// Same aux-route (outlet: 'modal') pattern as course-tile-edit-routing-
// dialog.component.ts, for Ausfahrten instead of Kurse - no courseKind to
// resolve, just an event-type draft or an existing tile by id.
@Component({
    selector: 'app-event-tile-edit-routing-dialog',
    standalone: true,
    template: '',
})
export class EventTileEditRoutingDialogComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly dataService = inject(TilesDataService);
    private readonly tileChanges = inject(TileChangesService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        // Neu: Reiter-Art als Matrix-Parameter (…/neu;kind=info); bestehende Tiles leiten sie aus Typ/Aktionen ab.
        const newKind = (this.route.snapshot.paramMap.get('kind') as TileKind | null) ?? 'trip';

        if (id && id !== 'neu') {
            this.dataService.getTile(id).subscribe({
                next: (tile) => this.open(tile, tileKindOf(tile)),
                error: () => this.close(),
            });
            return;
        }

        this.open(buildBlankTile(newKind), newKind);
    }

    private open(tile: Tile, kind: TileKind): void {
        const dialogRef = this.dialog.open(EventTileEditDialogComponent, {
            data: { tile, kind },
            panelClass: 'tile-dialog-panel',
            position: { top: '0', right: '0', bottom: '0' },
            width: '640px',
            maxWidth: '95vw',
            height: '100vh',
            hasBackdrop: true,
            enterAnimationDuration: '200ms',
            exitAnimationDuration: '150ms',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.tileChanges.notifyChanged();
            this.close();
        });
    }

    private close(): void {
        this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
    }
}
