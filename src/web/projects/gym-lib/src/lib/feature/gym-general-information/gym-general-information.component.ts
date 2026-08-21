/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, inject } from '@angular/core';
import { GymInformationCoreServiceInterface } from '../../domain';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownRenderService } from '@shared/util-markdown';
import { GYM_MONDAY_TILES } from 'projects/data/static';

@Component({
    selector: 'lib-gym-general-information',
    templateUrl: './gym-general-information.component.html',
    styleUrls: ['./gym-general-information.component.scss'],
    imports: [AsyncPipe, MatIconModule],
})
export class GymGeneralInformationComponent {
    @Input() gymState!: GymInformationCoreServiceInterface;

    public markdown = inject(MarkdownRenderService);
    public mondayTiles = GYM_MONDAY_TILES;
    public mondayTileNames = GYM_MONDAY_TILES.map((tile) => tile.title);
}
