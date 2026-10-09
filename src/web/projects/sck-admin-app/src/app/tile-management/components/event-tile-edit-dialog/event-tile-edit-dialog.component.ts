import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Tile } from '../../domain/tile';
import { TileEditorComponent } from '../tile-editor/tile-editor.component';

export interface EventTileEditDialogData {
    tile: Tile;
}

// Same shape as CourseTileEditDialogComponent (see its own reasoning for why
// this isn't built on DialogShellComponent), for Ausfahrten instead of
// Kurse - no courseKind, TileEditorComponent's fixedType stays undefined so
// it renders the tripConfig/pricing section instead of the Kurse one.
@Component({
    selector: 'app-event-tile-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, TileEditorComponent],
    templateUrl: './event-tile-edit-dialog.component.html',
    styleUrls: ['./event-tile-edit-dialog.component.scss'],
})
export class EventTileEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<EventTileEditDialogComponent>);
    public readonly data = inject<EventTileEditDialogData>(MAT_DIALOG_DATA);

    get title(): string {
        return this.data.tile.id.startsWith('new-') ? 'Ausfahrt anlegen' : 'Ausfahrt bearbeiten';
    }

    onSaved(): void {
        this.dialogRef.close(true);
    }
}
