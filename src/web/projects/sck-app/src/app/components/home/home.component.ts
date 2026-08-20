/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CoursesFeatureModule } from '@courses-lib';
import { COURSE_DATA, PROGRAMM_DOWNLOAD_LINK, STATIC_DATA, TRIP_DATA } from '@data';
import { GymFeatureModule } from '@gym-lib';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { TripsFeatureModule } from '@trips-lib';
import {
    InfoTile,
    Tile,
    TileActions,
    TileBehavior,
    TileStatus,
    TileType,
} from 'projects/shared-lib/src/lib/ui-common/models';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';
import { TRIPS_ROUTE } from '../../route-segments';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CommonModule,
        ComponentsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatSliderModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        CoursesFeatureModule,
        GymFeatureModule,
        TripsFeatureModule,
        SiteHeaderComponent,
    ],
})
export class HomeComponent implements OnInit {
    public title = 'Aktuelles';
    public tileStatusEnum = TileStatus;
    public tileActionsEnum = TileActions;
    public tileBehaviorEnum = TileBehavior;
    public tileTypeEnum = TileType;
    public registerLabel = 'Anmelden';
    public tiles: Tile[] = [];
    public programmDownloadLink = PROGRAMM_DOWNLOAD_LINK;

    private trips = TRIP_DATA;
    private courses = COURSE_DATA;
    private staticData = STATIC_DATA;

    public router = inject(Router);
    public markdown = inject(MarkdownRenderService);

    ngOnInit(): void {
        const homeTiles: Tile[] = [...this.courses, ...this.staticData, ...this.trips];

        homeTiles.sort((a, b) => {
            return a.order > b.order // Handle order
                ? -1
                : b.expiration.getTime() - a.expiration.getTime(); // Handle expiration
        });

        // then place expired events at the end (stable: keeps the previous ordering within each group)
        const now = new Date().getTime();
        homeTiles.sort((a, b) => {
            const aExpired = a.expiration.getTime() < now;
            const bExpired = b.expiration.getTime() < now;
            if (aExpired === bExpired) return 0;
            return aExpired ? 1 : -1;
        });

        homeTiles.map((t) => {
            t.expired = t.expiration.getTime() < new Date().getTime() ? true : false;
            t.visible = t.visible === false ? false : true;
        });

        this.tiles = homeTiles;
    }

    public openRegisterDialog(tile: Tile) {
        this.router.navigate([{ outlets: { modal: ['register', tile.id] } }]);
    }

    public openTripDetail(tile: Tile): void {
        this.router.navigate([TRIPS_ROUTE, tile.id]);
    }

    public openLink(link: string | undefined) {
        if (link) {
            window.open(link, '_blank');
        }
    }

    /**
     * Builds the description markdown for non-trip tiles (info tiles get
     * their location/timeData appended). Trip (Event) tiles no longer render
     * inline on the home tile - their full description now lives on the
     * trip detail page (TripDetailComponent in trips-lib), which builds its
     * own event-specific markdown (destination, boardings, pricing table).
     */
    public getTileDescription(tile: Tile): string {
        if (tile.type === TileType.Info) {
            const infoTile = tile as InfoTile;
            let content = tile.description || '';
            if (infoTile.location) {
                content += `\n\n**Ort:** ${infoTile.location}\n`;
            }
            if (infoTile.timeData && infoTile.timeData.length > 0) {
                content += '\n\n**Zeiten**\n\n';
                infoTile.timeData.forEach((time) => {
                    content += `- ${time}\n`;
                });
            }
            return content;
        }

        return tile.description;
    }
}
