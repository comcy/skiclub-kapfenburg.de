/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseConfig } from '../domain/models/course-config';

// Deliberately not a full Tile/CourseTile mapping - the public site never
// displays these tiles, it only reads their BCC config (see courseConfig in
// the trip-registration-plan follow-up), so id/title/courseConfig is all
// any consumer needs.
export interface ApiCourseBccTile {
    id: string;
    title: string;
    courseConfig?: CourseConfig;
}

// Same DI-token pattern as TripTilesApiServiceInterface: interface lives
// here (courses-lib, alongside the components/gym-lib that need it), the
// concrete HTTP-calling implementation lives in sck-app.
@Injectable()
export abstract class CourseTilesApiServiceInterface {
    public abstract getAllCourseBccTiles(): Observable<ApiCourseBccTile[]>;
}
