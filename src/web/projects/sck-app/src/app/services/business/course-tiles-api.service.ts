/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
    ApiCourseTile,
    CourseTilesApiServiceInterface,
} from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { SkiCoursePricing } from 'projects/courses-lib/src/lib/domain/models/ski-course-pricing';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { formatGermanDate, resolveMediaUrl } from './normalize-admin-tile-fields';

interface ApiTilesResponse {
    items: ApiCourseTile[];
    total: number;
}

// Both fields come straight from the admin's generic tile editor (raw ISO
// date, /media/-relative image path) - normalized here, once, so every
// consumer (mergeCourseTile, courses.component.ts, gym-lib's course-detail)
// can keep just interpolating apiTile.image/date directly.
function normalizeApiCourseTile(tile: ApiCourseTile): ApiCourseTile {
    return {
        ...tile,
        image: resolveMediaUrl(tile.image),
        date: formatGermanDate(tile.date),
        course: tile.course
            ? { ...tile.course, date: tile.course.date ? formatGermanDate(tile.course.date) : tile.course.date }
            : tile.course,
    };
}

const EMPTY_SKI_COURSE_PRICING: SkiCoursePricing = {
    childUntilAge: 16,
    snowboard: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
    alpine: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
};

/**
 * Admin-managed content for the "Kurse" section (ski levels A1-F2, Pilates
 * Do/Mi) - never blocks a registration/page render on failure, an empty
 * list here just means every mergeCourseTile()/mail-BCC lookup falls back
 * to the static defaults.
 */
@Injectable()
export class CourseTilesApiService implements CourseTilesApiServiceInterface {
    private readonly http = inject(HttpClient);

    private readonly courseTiles$: Observable<ApiCourseTile[]> = this.http
        .get<ApiTilesResponse>(`${environment.sckApiUrl}/tiles`, { params: { type: 'course', limit: '1000' } })
        .pipe(
            map((response) => response.items.map(normalizeApiCourseTile)),
            catchError(() => of([])),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    private readonly skiCoursePricing$: Observable<SkiCoursePricing> = this.http
        .get<SkiCoursePricing>(`${environment.sckApiUrl}/settings/ski-course-pricing`)
        .pipe(
            catchError(() => of(EMPTY_SKI_COURSE_PRICING)),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    getAllCourseTiles(): Observable<ApiCourseTile[]> {
        return this.courseTiles$;
    }

    getSkiCoursePricing(): Observable<SkiCoursePricing> {
        return this.skiCoursePricing$;
    }
}

export const courseTilesApiServiceProvider = {
    provide: CourseTilesApiServiceInterface,
    useClass: CourseTilesApiService,
};
