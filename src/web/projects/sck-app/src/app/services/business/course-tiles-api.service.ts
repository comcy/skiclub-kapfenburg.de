/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
    ApiCourseBccTile,
    CourseTilesApiServiceInterface,
} from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiTilesResponse {
    items: ApiCourseBccTile[];
    total: number;
}

/**
 * BCC config for the "Kurse" admin section (ski levels A1-F2, Pilates
 * Do/Mi) - never blocks a registration on failure, an empty list here just
 * means every mail-BCC function below falls back to its hardcoded default.
 */
@Injectable()
export class CourseTilesApiService implements CourseTilesApiServiceInterface {
    private readonly http = inject(HttpClient);

    private readonly courseTiles$: Observable<ApiCourseBccTile[]> = this.http
        .get<ApiTilesResponse>(`${environment.sckApiUrl}/tiles`, { params: { type: 'course', limit: '1000' } })
        .pipe(
            map((response) => response.items),
            catchError(() => of([])),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    getAllCourseBccTiles(): Observable<ApiCourseBccTile[]> {
        return this.courseTiles$;
    }
}

export const courseTilesApiServiceProvider = {
    provide: CourseTilesApiServiceInterface,
    useClass: CourseTilesApiService,
};
