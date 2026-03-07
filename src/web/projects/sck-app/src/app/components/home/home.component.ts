/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { GymFeatureModule } from '@gym-lib';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { TripsFeatureModule } from '@trips-lib';
import { PROGRAMM_DOWNLOAD_LINK } from 'projects/data/downloads';
import { TilesDataService } from '../../services/tiles-data.service';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    EventTile,
    InfoTile,
    Tile,
    TileActions,
    TileBehavior,
    TileStatus,
    TileType,
} from 'projects/shared-lib/src/lib/ui-common/models';
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

    public router = inject(Router);
    public dialog = inject(MatDialog);
    public markdown = inject(MarkdownRenderService);
    private readonly tilesDataService = inject(TilesDataService);

    ngOnInit(): void {
        this.tilesDataService.getTiles().subscribe((tiles) => {
            tiles.sort((a, b) => {
                return a.order > b.order // Handle order
                    ? -1
                    : 1 && b.expiration.getTime() - a.expiration.getTime(); // Handle expiration
            });

            // then place expired events at the end
            tiles.sort((a, b) => {
                if (a.expiration.getTime() < new Date().getTime()) return 1;
                else if (b.expiration.getTime() > new Date().getTime()) return -1;
                else return a.expiration.valueOf() - b.expiration.valueOf();
            });

            tiles.map((t) => {
                t.expired = t.expiration.getTime() < new Date().getTime() ? true : false;
                t.visible = t.visible === false ? false : true;
            });

            this.tiles = tiles;
        });
    }

    public openRegisterDialog(tile: Tile) {
        this.router.navigate([{ outlets: { modal: ['register', tile.id] } }]);
    }

    public openLink(link: string | undefined) {
        if (link) {
            window.open(link, '_blank');
        }
    }

    public getImageUrl(imagePath: string | undefined): string {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;

        const baseUrl = environment.sckApiUrl.replace(/\/api$/, '');
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }

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

        if (tile.type !== TileType.Event) {
            return tile.description;
        }

        const eventTile = tile as EventTile;
        let dynamicContent = tile.description || '';

        // 1. Destination / Location
        if (eventTile.destination) {
            dynamicContent += `\n\n**Ziel:** ${eventTile.destination}\n`;
        }
        if (eventTile.location) {
            dynamicContent += `\n\n**Ort:** ${eventTile.location}\n`;
        }

        // 2. Boarding List (Abfahrtszeiten)
        if (eventTile.boardings && eventTile.boardings.length > 0) {
            dynamicContent += '\n **Abfahrtszeiten**\n';
            eventTile.boardings.forEach((b: string) => {
                dynamicContent += ` - ${b}\n`;
            });
        }

        // 3. Pricing Table
        const pricing = eventTile.tripConfig?.pricing;
        if (pricing) {
            dynamicContent += '\n**Kosten**\n\n';
            dynamicContent += '| Bus + Liftkarte + Optionen | Mitglieder | Nicht-Mitglieder |\n';
            dynamicContent += '|:---|---:|---:|\n';

            // Bus + Lift
            if (pricing.busLift) {
                dynamicContent += `| Erwachsene | ${pricing.busLift.adult.member},00 € | ${pricing.busLift.adult.nonMember},00 € |\n`;
                dynamicContent += `| Jugendliche (bis 16 J.) | ${pricing.busLift.youthUntil16.member},00 € | ${pricing.busLift.youthUntil16.nonMember},00 € |\n`;
                dynamicContent += `| Kinder (bis 6 J.) | ${pricing.busLift.childUntil6.member},00 € | ${pricing.busLift.childUntil6.nonMember},00 € |\n`;
            }

            // Bus Only
            if (pricing.busOnly) {
                dynamicContent += `| Nur Busfahrt | ${pricing.busOnly.member},00 € | ${pricing.busOnly.nonMember},00 € |\n`;
            }

            // Addons
            const addons = pricing.addons;
            if (addons && Object.keys(addons).length > 0) {
                // Visual separator line
                dynamicContent += `| -------------------------- | ---------- | ---------- |\n`;

                if (addons.courseBeginner) {
                    dynamicContent += `| Anfängerkurs | ${addons.courseBeginner.member},00 € | ${addons.courseBeginner.nonMember},00 € |\n`;
                }
                if (addons.courseAdvanced) {
                    dynamicContent += `| Fortgeschrittenenkurs | ${addons.courseAdvanced.member},00 € | ${addons.courseAdvanced.nonMember},00 € |\n`;
                }
                if (addons.technikHalf) {
                    dynamicContent += `| Techniktraining (1/2 Tag) | ${addons.technikHalf.member},00 € | ${addons.technikHalf.nonMember},00 € |\n`;
                }
                if (addons.technikFull) {
                    dynamicContent += `| Techniktraining (ganzer Tag) | ${addons.technikFull.member},00 € | ${addons.technikFull.nonMember},00 € |\n`;
                }
                if (addons.snowshoes) {
                    dynamicContent += `| Schneeschuhe | ${addons.snowshoes.member},00 € | ${addons.snowshoes.nonMember},00 € |\n`;
                }
            }
        }

        // 4. Additional Information
        if (eventTile.additionalInformation) {
            dynamicContent += `\n---\n_*${eventTile.additionalInformation}_`;
        }

        return dynamicContent;
    }
}
