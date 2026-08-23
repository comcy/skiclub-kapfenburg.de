/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_AT_HOME_PRICE_DATA } from '@data';
import { CoursesUiModule } from '@courses-lib';
import { COURSE_LEVEL_TILES } from 'projects/data/static';
import {
    ApiCourseBccTile,
    CourseTilesApiServiceInterface,
} from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { Price } from 'projects/courses-lib/src/lib/domain/models';
import { InfoTile } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButtonModule, MatIconModule, CoursesUiModule, SiteHeaderComponent],
})
export class CoursesComponent implements OnInit {
    public title = 'Ski- und Snowboardschule';
    public color: MaterialColor = 'primary';

    public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;
    public levelTiles = COURSE_LEVEL_TILES;

    public registrationOpen = false;
    public selectedLevel: string | undefined;
    public selectedCustomBccList: string[] | undefined;

    public markdown = inject(MarkdownRenderService);
    private readonly courseTilesApi = inject(CourseTilesApiServiceInterface);

    // Loaded once on init - by the time a user picks a level and submits,
    // this has virtually always resolved (same assumption the trip flow
    // already relies on for tripConfig). An unresolved/failed fetch just
    // means the level lookup below finds nothing, and the mail-BCC function
    // falls back to its hardcoded default - never blocks registration.
    private courseBccTiles: ApiCourseBccTile[] = [];

    @ViewChild('registrationSection') registrationSection?: ElementRef<HTMLElement>;

    ngOnInit(): void {
        this.courseTilesApi.getAllCourseBccTiles().subscribe((tiles) => (this.courseBccTiles = tiles));
    }

    public openRegistrationFor(level: InfoTile): void {
        this.selectedLevel = level.title;
        // 'A1 – Anfänger Basis' -> 'A1' (matches the admin-managed tile's title).
        const code = level.title.split(' ')[0];
        this.selectedCustomBccList = this.courseBccTiles.find((tile) => tile.title === code)?.courseConfig
            ?.customBccList;
        this.registrationOpen = true;
        setTimeout(() => {
            this.registrationSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
