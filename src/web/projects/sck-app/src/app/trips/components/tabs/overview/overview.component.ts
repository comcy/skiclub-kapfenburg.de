/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { TRIP_DATA } from '@data';
import { EventTile, InfoTile, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';

const ALL = 'Alle';

@Component({
    selector: 'app-trips-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule],
})
export class OverviewComponent implements OnInit {
    public tileStatusEnum = TileStatus;
    public allTrips: EventTile[] = [];
    public filteredTrips: EventTile[] = [];
    /** Standing offers alongside the trips (e.g. Skibörse, Schneeschuhverleih) - not date-bound events. */
    public otherOffers: InfoTile[] = [];

    public audiences: string[] = [ALL];
    public destinations: string[] = [ALL];
    public periods: string[] = [ALL];

    public selectedAudience = ALL;
    public selectedDestination = ALL;
    public selectedPeriod = ALL;

    private readonly monthFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });

    ngOnInit(): void {
        this.allTrips = TRIP_DATA.filter((t): t is EventTile => t.type === TileType.Event).sort(
            (a, b) => a.expiration.getTime() - b.expiration.getTime(),
        );
        this.otherOffers = TRIP_DATA.filter((t): t is InfoTile => t.type === TileType.Info);

        this.audiences = [ALL, ...new Set(this.allTrips.map((t) => this.resolveAudience(t)).filter((a) => a !== ALL))];
        this.destinations = [ALL, ...new Set(this.allTrips.map((t) => t.destination).filter((d): d is string => !!d))];
        this.periods = [ALL, ...new Set(this.allTrips.map((t) => this.monthFormatter.format(t.expiration)))];

        this.applyFilters();
    }

    public resolveAudience(trip: EventTile): string {
        const subTitle = trip.subTitle.toLowerCase();
        if (subTitle.includes('familie')) return 'Familienfreundlich';
        if (subTitle.includes('18')) return 'Ab 18 Jahren';
        return ALL;
    }

    public resolvePrice(trip: EventTile): number | undefined {
        return trip.tripConfig?.pricing?.busLift?.adult?.member;
    }

    public resolveStatusLabel(trip: EventTile): string {
        switch (trip.status) {
            case TileStatus.BookedUp:
                return 'Warteliste';
            case TileStatus.Canceled:
                return 'Abgesagt';
            default:
                return 'Plätze frei';
        }
    }

    public applyFilters(): void {
        this.filteredTrips = this.allTrips.filter((trip) => {
            const matchesAudience =
                this.selectedAudience === ALL || this.resolveAudience(trip) === this.selectedAudience;
            const matchesDestination =
                this.selectedDestination === ALL || trip.destination === this.selectedDestination;
            const matchesPeriod =
                this.selectedPeriod === ALL || this.monthFormatter.format(trip.expiration) === this.selectedPeriod;
            return matchesAudience && matchesDestination && matchesPeriod;
        });
    }
}
