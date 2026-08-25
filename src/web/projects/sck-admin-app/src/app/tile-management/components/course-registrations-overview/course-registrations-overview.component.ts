import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';

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

    public tiles: Tile[] = [];
    public loaded = false;

    ngOnInit(): void {
        this.dataService.getTiles(1, 1000, undefined, undefined, undefined, 'course').subscribe((response) => {
            this.tiles = [...response.items].sort((a, b) => a.title.localeCompare(b.title));
            this.loaded = true;
            this.cdr.markForCheck();
        });
    }

    confirmedCount(tile: Tile): number {
        return tile.confirmedRegistrationsCount ?? 0;
    }
}
