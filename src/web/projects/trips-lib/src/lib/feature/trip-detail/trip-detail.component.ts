/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TRIP_DATA } from '@data';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { EventTile, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Subject, takeUntil } from 'rxjs';
import { Trip } from '../../domain/models/trip-base';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';

@Component({
    selector: 'lib-trip-detail',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule, RouterModule, MatCardModule, SiteHeaderComponent, TripsRegistrationFormComponent],
})
export class TripDetailComponent implements OnInit, OnDestroy {
    public tileStatusEnum = TileStatus;
    public tile: EventTile | undefined;
    public description = '';
    public registrationData: Trip[] = [];

    public markdown = inject(MarkdownRenderService);

    private route = inject(ActivatedRoute);
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const id = params.get('id');
            this.tile = id ? this.resolveTripById(id) : undefined;

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
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Resolves the trip tile behind the given id. Reads from the static
     * TRIP_DATA import for now - once trips move behind a backend API this
     * is the single spot to swap for a service/HTTP call, the rest of the
     * component stays the same.
     */
    private resolveTripById(id: string): EventTile | undefined {
        return TRIP_DATA.filter((t): t is EventTile => t.type === TileType.Event).find((t) => t.id === id);
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
