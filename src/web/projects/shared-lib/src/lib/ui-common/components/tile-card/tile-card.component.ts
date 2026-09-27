/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownRenderService } from '@shared/util-markdown';
import { CourseTile, EventTile, InfoTile, Tile, TileActions, TileStatus, TileType } from '../../models/tile';

export interface TileCardCtaOverride {
    label: string;
    icon?: string;
    color?: 'primary' | 'accent';
}

interface MetaChip {
    icon: string;
    label: string;
}

// The single visual source of truth for "what a tile looks like", used by
// both apps (public site AND the admin tile-editor preview) - see the
// tile-card unification plan. Previously six near-identical but diverging
// hand-rolled card markups (home carousel/trips-grid/info-tiles, trips
// overview trip-card/offer-card, course levels, gym cards, plus the admin
// mat-card preview) each re-derived badge/description/action logic
// slightly differently, so the admin preview never actually matched what
// visitors saw.
@Component({
    selector: 'shared-lib-tile-card',
    standalone: true,
    imports: [DatePipe, MatButtonModule, MatIconModule, MatTooltipModule],
    providers: [DatePipe],
    templateUrl: './tile-card.component.html',
    styleUrls: ['./tile-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileCardComponent {
    private readonly markdown = inject(MarkdownRenderService);
    private readonly datePipe = inject(DatePipe);

    @Input({ required: true }) tile!: Tile;
    /** Rewrites a possibly-relative image path to an absolute URL - the admin app resolves against its API base, public tiles already carry absolute/asset paths. */
    @Input() resolveImageUrl: (path: string) => string = (path) => path;
    /** Whole card acts as a link (e.g. gym/course teasers) instead of only the CTA button. */
    @Input() clickable = false;
    @Input() ctaOverride?: TileCardCtaOverride;
    /** Overrides the actions-row left-side label (price/boardings by default) - e.g. a synthetic teaser tile that isn't a real EventTile. */
    @Input() metaLabelOverride?: string;

    @Output() cardClick = new EventEmitter<void>();
    @Output() register = new EventEmitter<void>();
    @Output() download = new EventEmitter<void>();
    @Output() share = new EventEmitter<void>();

    public readonly tileType = TileType;
    public readonly tileStatus = TileStatus;
    public readonly tileActions = TileActions;
    public readonly weekdayLabels = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    get isEventFull(): boolean {
        if (this.tile.type !== TileType.Event) {
            return false;
        }
        const trip = this.tile as EventTile;
        return !!trip.capacity && (trip.confirmedRegistrationsCount ?? 0) >= trip.capacity;
    }

    // Badge shown top-left over the image - identical rule everywhere a
    // tile renders now, replacing the admin's rotated full-card "stamp"
    // treatment (same status, one visual language).
    get badgeLabel(): string | undefined {
        if (this.tile.status === TileStatus.Canceled) {
            return 'Abgesagt';
        }
        if (this.tile.status === TileStatus.BookedUp || this.isEventFull) {
            return 'Warteliste';
        }
        if (this.tile.type === TileType.Event) {
            return 'Plätze frei';
        }
        return undefined;
    }

    get badgeVariant(): 'warn' | 'off' | undefined {
        if (this.tile.status === TileStatus.Canceled) {
            return 'off';
        }
        if (this.tile.status === TileStatus.BookedUp || this.isEventFull) {
            return 'warn';
        }
        return undefined;
    }

    get description(): string {
        if (this.tile.type === TileType.Event) {
            return (this.tile as EventTile).destination ?? '';
        }
        if (this.tile.type === TileType.Course) {
            return this.markdown.render(this.tile.description || '');
        }
        return this.markdown.render(this.buildInfoDescription(this.tile as InfoTile));
    }

    // Port of home.component.ts's former getTileDescription(): Info tiles
    // append their location/timeData onto the description, other types
    // don't carry these fields at all.
    private buildInfoDescription(tile: InfoTile): string {
        let content = tile.description || '';
        if (tile.location) {
            content += `\n\n**Ort:** ${tile.location}\n`;
        }
        if (tile.timeData && tile.timeData.length > 0) {
            content += '\n\n**Zeiten**\n\n';
            tile.timeData.forEach((time) => {
                content += `- ${time}\n`;
            });
        }
        return content;
    }

    get metaChips(): MetaChip[] {
        if (this.tile.type !== TileType.Event) {
            return [];
        }
        const trip = this.tile as EventTile;
        const chips: MetaChip[] = [{ icon: 'event', label: trip.date }];
        if (trip.subTitle) {
            chips.push({ icon: 'groups', label: trip.subTitle });
        }
        return chips;
    }

    get priceLabel(): string | undefined {
        if (this.metaLabelOverride !== undefined) {
            return this.metaLabelOverride;
        }
        if (this.tile.type !== TileType.Event) {
            return undefined;
        }
        const price = (this.tile as EventTile).tripConfig?.pricing?.busLift?.adult?.member;
        return price ? `ab ${price} €` : undefined;
    }

    get boardingsLabel(): string | undefined {
        if (this.tile.type !== TileType.Event) {
            return undefined;
        }
        const count = (this.tile as EventTile).boardings?.length ?? 0;
        return count > 0 ? `${count} Zustiege` : undefined;
    }

    // Admin's own tile domain carries excludedDates as raw ISO strings
    // (ApiPilatesCourseDto), the public-site domain as real Date objects
    // (GymCourseSchedule) - format each explicitly rather than relying on
    // Array.join(), which calls the verbose Date.toString() on real dates.
    formatExcludedDates(dates: (Date | string)[]): string {
        return dates.map((date) => this.datePipe.transform(date, 'dd.MM.yyyy')).join(', ');
    }

    get courseInfo(): CourseTile['course'] | undefined {
        return this.tile.type === TileType.Course ? (this.tile as CourseTile).course : undefined;
    }

    get cta(): TileCardCtaOverride {
        if (this.ctaOverride) {
            return this.ctaOverride;
        }
        if (this.tile.type === TileType.Event) {
            const waitlisted = this.tile.status === TileStatus.BookedUp || this.isEventFull;
            return { label: waitlisted ? 'Warteliste' : 'Anmelden', icon: 'event_note', color: 'primary' };
        }
        return { label: 'Anmelden', icon: 'event_note', color: 'accent' };
    }

    onCardClick(): void {
        if (this.clickable) {
            this.cardClick.emit();
        }
    }

    onActionClick(event: Event, emitter: EventEmitter<void>): void {
        event.stopPropagation();
        emitter.emit();
    }
}
