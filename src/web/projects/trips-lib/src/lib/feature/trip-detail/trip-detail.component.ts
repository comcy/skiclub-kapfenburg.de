/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { EventTile, Tile, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Subject, map, switchMap, takeUntil } from 'rxjs';
import { TripTilesApiServiceInterface } from '../../api/trip-tiles-api.interface';
import { Trip } from '../../domain/models/trip-base';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';

@Component({
    selector: 'lib-trip-detail',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        SiteHeaderComponent,
        TripsRegistrationFormComponent,
    ],
})
export class TripDetailComponent implements OnInit, OnDestroy {
    public tileStatusEnum = TileStatus;
    public tile: EventTile | undefined;
    public description = '';
    public registrationData: Trip[] = [];
    public registrationOpen = false;

    public markdown = inject(MarkdownRenderService);

    private route = inject(ActivatedRoute);
    private tripsApi = inject(TripTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap((params) =>
                    this.tripsApi.getAllTrips().pipe(map((trips) => ({ id: params.get('id'), trips }))),
                ),
                takeUntil(this.destroy$),
            )
            .subscribe(({ id, trips }) => {
                this.tile = id ? this.resolveTripById(id, trips) : undefined;
                this.registrationOpen = false;

                if (this.tile) {
                    this.description = this.buildDescription(this.tile);
                    this.registrationData = [
                        {
                            destination: this.tile.destination || this.tile.title,
                            date: this.tile.date,
                            availableBoardings: this.tile.boardings ?? [],
                            tripConfig: this.tile.tripConfig,
                        },
                    ];
                }

                // Needed on top of the automatic zone-triggered check: this runs
                // inside an HttpClient response nested two operators deep
                // (switchMap -> getAllTrips()'s own shareReplay/catchError), and
                // without this the view keeps showing its pre-response state.
                this.cdr.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private resolveTripById(id: string, trips: Tile[]): EventTile | undefined {
        return trips.filter((t): t is EventTile => t.type === TileType.Event).find((t) => t.id === id);
    }

    public isTripFull(tile: EventTile): boolean {
        return !!tile.capacity && (tile.confirmedRegistrationsCount ?? 0) >= tile.capacity;
    }

    private buildDescription(tile: EventTile): string {
        let content = tile.description || '';

        // 1. Destination / Location
        if (tile.destination) {
            content += `\n\n**Ziel:** ${tile.destination}\n`;
        }
        if (tile.location) {
            content += `\n\n**Ort:** ${tile.location}\n`;
        }

        // 2. Boarding List (Abfahrtszeiten)
        if (tile.boardings && tile.boardings.length > 0) {
            content += '\n **Abfahrtszeiten**\n';
            tile.boardings.forEach((b: string) => {
                content += ` - ${b}\n`;
            });
        }

        // 3. Pricing Table
        const pricing = tile.tripConfig?.pricing;
        if (pricing) {
            content += '\n**Kosten**\n\n';
            content += '| Bus + Liftkarte + Optionen | Mitglieder | Nicht-Mitglieder |\n';
            content += '|:---|---:|---:|\n';

            // Bus + Lift
            if (pricing.busLift) {
                content += `| Erwachsene | ${pricing.busLift.adult.member},00 € | ${pricing.busLift.adult.nonMember},00 € |\n`;
                content += `| Jugendliche (bis 16 J.) | ${pricing.busLift.youthUntil16.member},00 € | ${pricing.busLift.youthUntil16.nonMember},00 € |\n`;
                content += `| Kinder (bis 6 J.) | ${pricing.busLift.childUntil6.member},00 € | ${pricing.busLift.childUntil6.nonMember},00 € |\n`;
            }

            // Bus Only
            if (pricing.busOnly) {
                content += `| Nur Busfahrt | ${pricing.busOnly.member},00 € | ${pricing.busOnly.nonMember},00 € |\n`;
            }

            // Addons
            const addons = pricing.addons;
            if (addons && Object.keys(addons).length > 0) {
                // Visual separator line
                content += `| -------------------------- | ---------- | ---------- |\n`;

                if (addons.courseBeginner) {
                    content += `| Anfängerkurs | ${addons.courseBeginner.member},00 € | ${addons.courseBeginner.nonMember},00 € |\n`;
                }
                if (addons.courseAdvanced) {
                    content += `| Fortgeschrittenenkurs | ${addons.courseAdvanced.member},00 € | ${addons.courseAdvanced.nonMember},00 € |\n`;
                }
                if (addons.technikHalf) {
                    content += `| Techniktraining (1/2 Tag) | ${addons.technikHalf.member},00 € | ${addons.technikHalf.nonMember},00 € |\n`;
                }
                if (addons.technikFull) {
                    content += `| Techniktraining (ganzer Tag) | ${addons.technikFull.member},00 € | ${addons.technikFull.nonMember},00 € |\n`;
                }
                if (addons.snowshoes) {
                    content += `| Schneeschuhe | ${addons.snowshoes.member},00 € | ${addons.snowshoes.nonMember},00 € |\n`;
                }
            }
        }

        // 4. Additional Information
        if (tile.additionalInformation) {
            content += `\n---\n_*${tile.additionalInformation}_`;
        }

        return content;
    }
}
