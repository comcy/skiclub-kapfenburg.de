import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Tile } from '../../domain/tile';
import { TileActions, TileStatus } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-tile-preview',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './tile-preview.component.html',
    styleUrls: ['./tile-preview.component.scss'],
})
export class TilePreviewComponent {
    private readonly tilesDataService = inject(TilesDataService);

    @Input() tile: Tile | null = null;

    public tileStatusEnum = TileStatus;
    public tileActionsEnum = TileActions;

    public getImageUrl(imagePath: string | undefined): string {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;

        // Construct absolute URL from relative API path
        // Remove /api from apiUrl if imagePath already starts with /api
        const baseUrl = this.tilesDataService.apiUrl.replace(/\/api$/, '');
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }

    renderMarkdown(text: string): string {
        return text ? text.replace(/\n/g, '<br>') : '';
    }
}
