import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseRegistration } from '../../domain/course-registration';
import { NewsService } from '../../../shared/services/news.service';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';

export interface CourseOverviewRow {
    tile: Tile;
    // Ski Alpin / Snowboard bei Ski-Kursen - undefined bei Kursen ohne Sportart (Gymnastik).
    sport?: string;
    count: number;
    // Davon neu seit dem letzten Login ("Alles gesehen").
    newCount: number;
}

// Kurs-Pendant zu RegistrationsOverviewComponent - ohne Kapazitäts-/
// Wartelisten-Badge, da course_registrations dieses Konzept nicht kennt.
@Component({
    selector: 'app-course-registrations-overview',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
    templateUrl: './course-registrations-overview.component.html',
    styleUrls: ['./course-registrations-overview.component.scss'],
})
export class CourseRegistrationsOverviewComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly news = inject(NewsService);

    public rows: CourseOverviewRow[] = [];
    public loaded = false;

    ngOnInit(): void {
        this.dataService.getTiles(1, 1000, undefined, undefined, undefined, 'course').subscribe((response) => {
            const tiles = [...response.items].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
            if (!tiles.length) {
                this.loaded = true;
                this.cdr.markForCheck();
                return;
            }
            // Je Kurs die Anmeldungen laden, um nach Sportart zu trennen (A1 Ski und A1
            // Snowboard sind getrennte Gruppen) - Vereinsgröße, wenige Kurs-Tiles.
            forkJoin(tiles.map((tile) => this.dataService.getCourseRegistrations(tile.id))).subscribe((lists) => {
                this.rows = tiles.flatMap((tile, index) => this.toRows(tile, lists[index]));
                this.loaded = true;
                this.cdr.markForCheck();
            });
        });
    }

    private toRows(tile: Tile, registrations: CourseRegistration[]): CourseOverviewRow[] {
        const confirmed = registrations.filter((r) => r.status === 'confirmed');
        const bySport = new Map<string, { count: number; newCount: number }>();
        for (const r of confirmed) {
            const sport = r.sportType?.trim() || '';
            const entry = bySport.get(sport) ?? { count: 0, newCount: 0 };
            entry.count += 1;
            if (this.news.isNew(r.createdAt)) entry.newCount += 1;
            bySport.set(sport, entry);
        }
        if (!bySport.size) return [{ tile, count: 0, newCount: 0 }];
        return [...bySport.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([sport, { count, newCount }]) => ({ tile, sport: sport || undefined, count, newCount }));
    }
}
