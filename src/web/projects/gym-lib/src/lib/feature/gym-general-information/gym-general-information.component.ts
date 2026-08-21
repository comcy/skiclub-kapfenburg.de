/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_DATA } from '@data';
import { GYM_OFFER_TILES } from 'projects/data/static';
import { CourseTile, TileType } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'lib-gym-general-information',
    templateUrl: './gym-general-information.component.html',
    styleUrls: ['./gym-general-information.component.scss'],
    imports: [MatIconModule, RouterModule],
})
export class GymGeneralInformationComponent {
    public markdown = inject(MarkdownRenderService);
    public pilatesTiles = COURSE_DATA.filter((t): t is CourseTile => t.type === TileType.Course);
    public offerTiles = GYM_OFFER_TILES;
}
