import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Tile } from '../../domain/tile';
import { TileStatus } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';

// Dedicated shortcut page for "wie steht diese Ausfahrt gerade" - the
// generic Tiles list already has a per-row "Anmeldungen" button, but it's
// buried behind tile-editor columns (Order/Subtitle/Behavior/...) and
// pagination that don't matter here. This page shows only what's relevant
// to registrations: date, status, capacity/waitlist.
@Component({
    selector: 'app-registrations-overview',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
    templateUrl: './registrations-overview.component.html',
    styleUrls: ['./registrations-overview.component.scss'],
})
export class RegistrationsOverviewComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public readonly tileStatusEnum = TileStatus;
    public tiles: Tile[] = [];
    public loaded = false;

    ngOnInit(): void {
        // Same "all event tiles in one go" call as the dashboard - club-scale
        // data, no pagination UI needed here either.
        this.dataService.getTiles(1, 1000, undefined, undefined, undefined, 'event').subscribe((response) => {
            this.tiles = [...response.items].sort((a, b) => {
                if (!!a.expired !== !!b.expired) return a.expired ? 1 : -1;
                return new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
            });
            this.loaded = true;
            this.cdr.markForCheck();
        });
    }

    confirmedCount(tile: Tile): number {
        return tile.confirmedRegistrationsCount ?? 0;
    }

    isOverCapacity(tile: Tile): boolean {
        return !!tile.capacity && this.confirmedCount(tile) >= tile.capacity;
    }

    resolveStatusLabel(tile: Tile): string {
        switch (tile.status) {
            case TileStatus.Canceled:
                return 'Abgesagt';
            case TileStatus.BookedUp:
                return 'Warteliste';
            default:
                return this.isOverCapacity(tile) ? 'Warteliste' : 'Offen';
        }
    }
}
