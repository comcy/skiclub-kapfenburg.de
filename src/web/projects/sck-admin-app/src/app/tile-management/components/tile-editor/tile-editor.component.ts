import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tile, TileCreationParams } from '../../domain/tile';
import { TileActions, TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';
import { EditableDateComponent } from '../editable-date/editable-date.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';
import { EditableLinkComponent } from '../editable-link/editable-link.component';
import { EditableTextareaComponent } from '../editable-textarea/editable-textarea.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { TilePreviewComponent } from '../tile-preview/tile-preview.component';
import { BoardingsDataService } from '../../../boardings-management/services/boardings-data.service';
import { Boarding } from '../../../boardings-management/domain/boarding';

@Component({
    selector: 'app-tile-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        EditableTextComponent,
        EditableTextareaComponent,
        EditableImageComponent,
        EditableLinkComponent,
        EditableDateComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        TilePreviewComponent,
    ],
    templateUrl: './tile-editor.component.html',
    styleUrls: ['./tile-editor.component.scss'],
})
export class TileEditorComponent implements OnInit {
    @Input() tile: Tile | null = null;
    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);

    public tileTypes = Object.values(TileType);
    public tileStatus = Object.values(TileStatus);
    public tileBehaviors = Object.values(TileBehavior);
    public tileActions = Object.values(TileActions);

    public availableBoardings$!: Observable<Boarding[]>;

    ngOnInit(): void {
        // Load all boardings for the dropdown (up to 1000)
        this.availableBoardings$ = this.boardingsService.getBoardings(1, 1000).pipe(map((response) => response.items));
    }

    public get boardingsAsString(): string {
        return this.tile?.boardings?.join('\n') ?? '';
    }

    public set boardingsAsString(value: string) {
        if (this.tile) {
            this.tile.boardings = value.split('\n');
        }
    }

    onImageSelected(file: File): void {
        if (this.tile) {
            this.dataService.uploadImage(file).subscribe({
                next: (image) => {
                    if (this.tile) {
                        this.tile.image = image.url;
                        this.tile.imageId = image.id;
                    }
                },
                error: (err) => console.error('uploadImage error:', err),
            });
        }
    }

    onImageRemoved(): void {
        if (this.tile) {
            this.tile.image = '';
            this.tile.imageId = undefined;
        }
    }

    onSave(): void {
        if (this.tile) {
            console.log('tile before save:', JSON.stringify(this.tile, null, 2));
            if (this.tile.id.startsWith('new-')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...tile } = this.tile;
                this.dataService.createTile(tile as TileCreationParams).subscribe({
                    error: (err) => console.error('createTile error:', err),
                });
            } else {
                this.dataService.updateTile(this.tile.id, this.tile).subscribe({
                    error: (err) => console.error('updateTile error:', err),
                });
            }
        }
    }
}
