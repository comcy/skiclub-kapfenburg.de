/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
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
import { CoursesFeatureModule } from '@courses-lib';
import { PROGRAMM_DOWNLOAD_LINK, STATIC_DATA, TRIP_DATA } from '@data';
import { GymFeatureModule } from '@gym-lib';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { TripsFeatureModule, TripsRegisterDialogComponent } from '@trips-lib';
import { GymCoursesRegisterDialogComponent } from 'projects/gym-lib/src/lib/feature/gym-courses-register-dialog/gym-courses-register-dialog.component';
import { Tile, TileActions, TileBehavior, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
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
    public registerLabel = 'Anmelden';
    public tiles: Tile[] = [];
    public programmDownloadLink = PROGRAMM_DOWNLOAD_LINK;

    private trips = TRIP_DATA;
    private staticData = STATIC_DATA;

    public dialog = inject(MatDialog);
    public markdown = inject(MarkdownRenderService);

    ngOnInit(): void {
        const homeTiles: Tile[] = [...this.staticData, ...this.trips];

        homeTiles.sort((a, b) => {
            return a.order > b.order // Handle order
                ? -1
                : 1 && b.expiration.getTime() - a.expiration.getTime(); // Handle expiration
        });

        // then place expired events at the end
        homeTiles.sort((a, b) => {
            if (a.expiration.getTime() < new Date().getTime()) return 1;
            else if (b.expiration.getTime() > new Date().getTime()) return -1;
            else return a.expiration.valueOf() - b.expiration.valueOf();
        });

        homeTiles.map((t) => {
            t.expired = t.expiration.getTime() < new Date().getTime() ? true : false;
            t.visible = t.visible === false ? false : true;
        });

        this.tiles = homeTiles;
    }

    public openRegisterDialog(tile: Tile) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            tile,
        };
        const comp = this.resolveRegisterDialogComponent(tile);
        const dialogRef = this.dialog.open(comp, dialogConfig);

        dialogRef.afterClosed().subscribe();
    }

    public resolveRegisterDialogComponent(tile: Tile): Type<unknown> {
        return tile.type === TileType.Course ? GymCoursesRegisterDialogComponent : TripsRegisterDialogComponent;
    }

    public openLink(link: string | undefined) {
        if (link) {
            window.open(link, '_blank');
        }
    }
}
