/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { COURSE_DATA } from '@data';
import { SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { CourseTile, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Subject, takeUntil } from 'rxjs';
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
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const id = params.get('id');
            this.tile = id ? this.resolveCourseById(id) : undefined;
            this.registrationOpen = false;
            this.registrationData = this.tile ? [this.tile.course] : [];
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
