/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PROGRAMM_DOWNLOAD_LINK, STATIC_DATA, TRIP_DATA } from '@data';
import { MarkdownRenderService } from '@shared/util-markdown';
import { TripsRegisterDialogComponent } from '@trips-lib';
import { Tile, TileActions, TileBehavior, TileStatus } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
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

    constructor(
        public dialog: MatDialog,
        public markdown: MarkdownRenderService,
    ) {}

    ngOnInit(): void {
        const homeTiles: Tile[] = this.staticData.concat(this.trips);

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
        (dialogConfig.height = '800px'),
            (dialogConfig.width = '900px'),
            (dialogConfig.data = {
                tile,
            });

        const dialogRef = this.dialog.open(TripsRegisterDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe();
    }

    public openDetailDialog(tile: Tile) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            tile,
        };

        const dialogRef = this.dialog.open(TripsRegisterDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe();
    }

    public openLink(link: string | undefined) {
        if (link) {
            window.open(link, '_blank');
        }
    }
}
