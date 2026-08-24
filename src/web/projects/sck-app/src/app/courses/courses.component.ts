/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import {
    ChangeDetectorRef,
    Component,
    ChangeDetectionStrategy,
    ElementRef,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_AT_HOME_PRICE_DATA } from '@data';
import { CoursesUiModule } from '@courses-lib';
import { COURSE_LEVEL_TILES } from 'projects/data/static';
import {
    ApiCourseTile,
    CourseTilesApiServiceInterface,
} from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { mergeCourseTile } from 'projects/courses-lib/src/lib/domain/merge-course-tile';
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
    public levelTiles: InfoTile[] = COURSE_LEVEL_TILES;

    public registrationOpen = false;
    public selectedLevel: string | undefined;
    public selectedCustomBccList: string[] | undefined;

    public markdown = inject(MarkdownRenderService);
    private readonly courseTilesApi = inject(CourseTilesApiServiceInterface);
    private readonly cdr = inject(ChangeDetectorRef);

    // level.id -> the matching admin tile's BCC list, resolved once at fetch
    // time and keyed by the STATIC level id (not the possibly-admin-renamed
    // title) so a later lookup by id is unaffected by content edits.
    private bccByLevelId = new Map<string, string[] | undefined>();

    @ViewChild('registrationSection') registrationSection?: ElementRef<HTMLElement>;

    // Same combineLatest/HTTP-subscribe gap found in gym-lib's
    // CourseDetailComponent: levelTiles is bound directly in the template,
    // so the reassignment below needs an explicit markForCheck() to render.
    ngOnInit(): void {
        this.courseTilesApi.getAllCourseTiles().subscribe((apiTiles: ApiCourseTile[]) => {
            this.levelTiles = COURSE_LEVEL_TILES.map((level) => {
                // 'A1 – Anfänger Basis' -> 'A1' (matches the admin-managed tile's title).
                const code = level.title.split(' ')[0];
                const match = apiTiles.find((tile) => tile.title === code);
                this.bccByLevelId.set(level.id, match?.courseConfig?.customBccList);
                return mergeCourseTile(level, match);
            });
            this.cdr.markForCheck();
        });
    }

    public openRegistrationFor(level: InfoTile): void {
        // The registration form's own "Könnerstufe" dropdown only offers the
        // 4 original hardcoded level strings - always preset from those, not
        // from a possibly admin-renamed display title, or the select would
        // show no matching option.
        const staticLevel = COURSE_LEVEL_TILES.find((l) => l.id === level.id);
        this.selectedLevel = staticLevel?.title ?? level.title;
        this.selectedCustomBccList = this.bccByLevelId.get(level.id);
        this.registrationOpen = true;
        setTimeout(() => {
            this.registrationSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
