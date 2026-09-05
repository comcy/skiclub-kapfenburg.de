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
import { MaterialColor, SiteHeaderComponent, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_AT_HOME_PRICE_DATA } from '@data';
import { CoursesUiModule } from '@courses-lib';
import { COURSE_LEVEL_TILES } from 'projects/data/static';
import {
    ApiCourseTile,
    CourseTilesApiServiceInterface,
} from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { mergeCourseTile } from 'projects/courses-lib/src/lib/domain/merge-course-tile';
import { Price, SkiCoursePricing } from 'projects/courses-lib/src/lib/domain/models';
import { InfoTile } from 'projects/shared-lib/src/lib/ui-common/models';

// Admin-created "Ski-/Snowboardkurse" tiles (course-management/skikurse in
// sck-admin-app) are the actual course entities now (#183) - any number of
// them, not just these 4. Still used as a content/copy fallback (title,
// self-assessment description) for the four levels this club has always
// offered, keyed by the tile-title code an admin tile needs to match to
// inherit that fallback text (see mapToDisplayTile below). A brand-new
// course tile with a different title just shows its own content, no
// fallback needed since the admin wrote it themselves.
const STATIC_LEVEL_BY_TITLE_CODE = new Map(COURSE_LEVEL_TILES.map((level) => [level.title.split(' ')[0], level]));

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
    public levelTiles: InfoTile[] = [];

    public registrationOpen = false;
    public selectedLevel: string | undefined;
    public selectedCustomBccList: string[] | undefined;
    public selectedTileId: string | undefined;
    public skiCoursePricing: SkiCoursePricing | null = null;

    public markdown = inject(MarkdownRenderService);
    private readonly courseTilesApi = inject(CourseTilesApiServiceInterface);
    private readonly cdr = inject(ChangeDetectorRef);

    // Display tile id -> the real admin tile it was built from, so
    // openRegistrationFor() can read the real id/BCC list/title code
    // without re-deriving them from the (possibly admin-renamed) display
    // title.
    private apiTileById = new Map<string, ApiCourseTile>();

    @ViewChild('registrationSection') registrationSection?: ElementRef<HTMLElement>;

    ngOnInit(): void {
        this.courseTilesApi.getAllCourseTiles().subscribe((apiTiles: ApiCourseTile[]) => {
            // Ski-/Snowboardkurse are course tiles WITHOUT a nested `course`
            // (Pilates) payload - same discriminator sck-admin-app's
            // CourseTileListComponent uses to split its two tabs.
            const skiCourseTiles = apiTiles
                .filter((tile) => !tile.course && tile.status !== TileStatus.Canceled && !tile.expired)
                .sort((a, b) => a.order - b.order);

            this.apiTileById = new Map(skiCourseTiles.map((tile) => [tile.id, tile]));
            // No admin-managed ski course tiles at all (fresh install, or
            // none created yet) - fall back to the 4 built-in levels rather
            // than showing an empty page. presetTileId stays unset for
            // these (see openRegistrationFor), same as the pre-existing
            // "no matching admin tile" behavior: the public sck-api write
            // is skipped, Sheets webhook + mail still work.
            this.levelTiles = skiCourseTiles.length
                ? skiCourseTiles.map((tile) => this.mapToDisplayTile(tile))
                : COURSE_LEVEL_TILES;
            this.cdr.markForCheck();
        });
        this.courseTilesApi.getSkiCoursePricing().subscribe((pricing) => {
            this.skiCoursePricing = pricing;
            this.cdr.markForCheck();
        });
    }

    private mapToDisplayTile(apiTile: ApiCourseTile): InfoTile {
        const staticFallback = STATIC_LEVEL_BY_TITLE_CODE.get(apiTile.title);
        if (staticFallback) {
            // Existing A1-F2 level: keep the hand-written self-assessment
            // copy as a fallback for whatever the admin tile leaves empty.
            // mergeCourseTile never overrides id/order/date (it only merges
            // content fields) - the merged tile would otherwise carry the
            // static fallback's placeholder id ("level-a1"), not the real
            // tile's, breaking openRegistrationFor()'s apiTileById lookup
            // and sending a nonexistent tileId to the backend.
            return {
                ...mergeCourseTile(staticFallback, apiTile),
                id: apiTile.id,
                order: apiTile.order,
                date: apiTile.date,
            };
        }

        // A genuinely new course tile (no matching static level) - the
        // admin tile IS the content, no fallback to merge onto.
        return {
            id: apiTile.id,
            order: apiTile.order,
            type: TileType.Info,
            title: apiTile.title,
            date: apiTile.date,
            subTitle: apiTile.subTitle,
            image: apiTile.image,
            imageDescription: apiTile.imageDescription,
            description: apiTile.description,
            details: apiTile.details,
            status: apiTile.status as TileStatus,
            expiration: new Date(apiTile.expiration),
            behavior: apiTile.behavior as TileBehavior,
        };
    }

    public openRegistrationFor(level: InfoTile): void {
        const apiTile = this.apiTileById.get(level.id);
        // Only pre-fill "Könnerstufe" when this is still one of the 4 known
        // levels: either the underlying real tile's title matches one (by
        // code), or - no admin tiles exist at all (see ngOnInit's fallback)
        // - `level` itself IS one of the static COURSE_LEVEL_TILES.
        const staticLevel = apiTile
            ? STATIC_LEVEL_BY_TITLE_CODE.get(apiTile.title)
            : COURSE_LEVEL_TILES.find((l) => l.id === level.id);
        this.selectedLevel = staticLevel?.title;
        this.selectedCustomBccList = apiTile?.courseConfig?.customBccList;
        // Only a real admin tile can be registered against server-side - no
        // apiTile means either a new freely-named tile's id (impossible,
        // apiTile always resolves for those) or the no-tiles-at-all
        // fallback, where presetTileId must stay unset so the form skips
        // the public sck-api write (Sheets webhook + mail still fire).
        this.selectedTileId = apiTile?.id;
        this.registrationOpen = true;
        setTimeout(() => {
            this.registrationSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
