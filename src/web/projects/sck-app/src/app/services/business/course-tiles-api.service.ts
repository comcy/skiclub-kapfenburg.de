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

interface ApiTilesResponse {
    items: ApiCourseTile[];
    total: number;
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
            map((response) => response.items),
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
