/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { COURSE_DATA } from '@data';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { CourseTilesApiServiceInterface } from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { mergeCourseTile } from 'projects/courses-lib/src/lib/domain/merge-course-tile';
import { CourseTile, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { GymCourseInformation } from '../../domain';
import { GymCoursesRegistrationFormComponent } from '../../ui/gym-courses-registration-form.component';

@Component({
    selector: 'lib-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        SiteHeaderComponent,
        GymCoursesRegistrationFormComponent,
    ],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
    public tileStatusEnum = TileStatus;
    public tile: CourseTile | undefined;
    public registrationData: GymCourseInformation[] = [];
    public registrationOpen = false;

    public markdown = inject(MarkdownRenderService);

    private route = inject(ActivatedRoute);
    private courseTilesApi = inject(CourseTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();

    // combineLatest([route.paramMap, HTTP-backed getAllCourseTiles()]) -
    // unlike the plain route.paramMap-only subscribe this replaces, the
    // combined emission isn't reliably picked up by automatic change
    // detection once the HTTP response resolves, so mark explicitly (same
    // pattern already established for the admin app's zoneless subscribes).
    ngOnInit(): void {
        combineLatest([this.route.paramMap, this.courseTilesApi.getAllCourseTiles()])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([params, apiTiles]) => {
                const id = params.get('id');
                const staticTile = id ? this.resolveCourseById(id) : undefined;
                this.registrationOpen = false;
                if (!staticTile) {
                    this.tile = undefined;
                    this.registrationData = [];
                    this.cdr.markForCheck();
                    return;
                }
                const match = apiTiles.find((t) => t.title === staticTile.course.name);
                this.tile = mergeCourseTile(staticTile, match);
                this.registrationData = [this.tile.course];
                this.cdr.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Resolves the course tile behind the given id. Reads from the static
     * COURSE_DATA import for now, mirroring TripDetailComponent's
     * resolveTripById.
     */
    private resolveCourseById(id: string): CourseTile | undefined {
        return COURSE_DATA.filter((t): t is CourseTile => t.type === TileType.Course).find((t) => t.id === id);
    }
}
