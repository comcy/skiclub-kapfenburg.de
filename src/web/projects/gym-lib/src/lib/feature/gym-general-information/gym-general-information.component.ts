/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TileCardComponent } from '@shared/ui-common';
import { COURSE_DATA } from '@data';
import { GYM_OFFER_TILES } from 'projects/data/static';
import { CourseTile, TileType } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'lib-gym-general-information',
    templateUrl: './gym-general-information.component.html',
    styleUrls: ['./gym-general-information.component.scss'],
    imports: [MatIconModule, RouterModule, TileCardComponent],
})
export class GymGeneralInformationComponent {
    private router = inject(Router);
    public pilatesTiles = COURSE_DATA.filter((t): t is CourseTile => t.type === TileType.Course);
    public offerTiles = GYM_OFFER_TILES;

    public openPilates(tile: CourseTile): void {
        this.router.navigate(['/gymnastik', tile.id]);
    }
}
