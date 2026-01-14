import { Component, Input, inject, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tile, TileCreationParams } from '../../domain/tile';
import { Image } from '../../domain/image';
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
        MatIconModule,
        TilePreviewComponent,
    ],
    templateUrl: './tile-editor.component.html',
    styleUrls: ['./tile-editor.component.scss'],
})
export class TileEditorComponent implements OnInit {
    @Input() tile: Tile | null = null;
    @Output() tileSaved = new EventEmitter<void>();

    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public isUploadingImage = false;
    public availableBoardings$: Observable<Boarding[]> | undefined;
    public isShowingPreview = false;

    public readonly tileTypes = Object.values(TileType);
    public readonly tileStatus = Object.values(TileStatus);
    public readonly tileBehaviors = Object.values(TileBehavior);
    public readonly tileActions = Object.values(TileActions);

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

    togglePreview(): void {
        this.isShowingPreview = !this.isShowingPreview;
    }

    onImageSelected(file: File): void {
        if (this.tile) {
            this.isUploadingImage = true;
            this.dataService.uploadImage(file).subscribe({
                next: (image: Image) => {
                    this.isUploadingImage = false;
                    if (this.tile) {
                        this.tile.image = image.url;
                        this.tile.imageId = image.id;
                        this.cdr.detectChanges();
                    }
                },
                error: (err: unknown) => {
                    this.isUploadingImage = false;
                    console.error('uploadImage error:', err);
                    this.cdr.detectChanges();
                },
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
                    next: (savedTile: Tile) => {
                        this.tile = savedTile;
                        this.tileSaved.emit();
                    },
                    error: (err: unknown) => console.error('createTile error:', err),
                });
            } else {
                this.dataService.updateTile(this.tile.id, this.tile).subscribe({
                    next: () => this.tileSaved.emit(),
                    error: (err: unknown) => console.error('updateTile error:', err),
                });
            }
        }
    }
}
