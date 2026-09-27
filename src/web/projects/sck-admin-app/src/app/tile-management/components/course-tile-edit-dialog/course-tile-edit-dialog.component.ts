import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CourseKind } from '../course-tile-list/course-tile-list.component';
import { Tile } from '../../domain/tile';
import { TileType } from '../../domain/tile-enums';
import { TileEditorComponent } from '../tile-editor/tile-editor.component';

export interface CourseTileEditDialogData {
    tile: Tile;
    courseKind: CourseKind;
}

// Thin MatDialogRef wrapper around TileEditorComponent - not built on
// DialogShellComponent, since TileEditorComponent already owns its own
// full layout (scrollable content + sticky footer with Speichern/Preview);
// wrapping it in a second title/content/actions slot system would only
// fight that, not help it.
@Component({
    selector: 'app-course-tile-edit-dialog',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, TileEditorComponent],
    templateUrl: './course-tile-edit-dialog.component.html',
    styleUrls: ['./course-tile-edit-dialog.component.scss'],
})
export class CourseTileEditDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<CourseTileEditDialogComponent>);
    public readonly data = inject<CourseTileEditDialogData>(MAT_DIALOG_DATA);
    public readonly courseType = TileType.Course;

    get title(): string {
        const kindLabel = this.data.courseKind === 'sport' ? 'Sportkurs' : 'Ski-/Snowboardkurs';
        return this.data.tile.id.startsWith('new-') ? `${kindLabel} anlegen` : `${kindLabel} bearbeiten`;
    }

    onSaved(): void {
        this.dialogRef.close(true);
    }
}
