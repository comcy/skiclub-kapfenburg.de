/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseConfig } from '../domain/models/course-config';
import { SkiCoursePricing } from '../domain/models/ski-course-pricing';

export interface ApiCoursePricesDto {
    member: string;
    nonMember: string;
}

export interface ApiCourseScheduleDto {
    weekday: number;
    startDate: string;
    endDate: string;
    excludedDates?: string[];
}

// Structural duplicate of gym-lib's GymCourseInformation (wire shape - dates
// as ISO strings, not Date objects) rather than importing it: gym-lib
// already imports CourseTilesApiServiceInterface/CourseConfig from here, so
// importing gym-lib's type back would create a courses-lib <-> gym-lib
// cycle. Same "duplicate rather than cross-import" convention already used
// elsewhere in this codebase (see sck-api's domain/tile.ts AgeCategory).
export interface ApiPilatesCourseDto {
    name: string;
    description: string;
    details: string;
    time: string;
    location: string;
    contact: string;
    prices?: ApiCoursePricesDto;
    date?: string;
    schedule?: ApiCourseScheduleDto;
    customBccList?: string[];
}

// Full display fields, not just BCC - the admin-managed tile is now the
// source of truth for course-tile content (title/description/image, and
// for Pilates tiles the nested course details), merged over the static
// fallback data by mergeCourseTile() (see ../domain/merge-course-tile.ts).
export interface ApiCourseTile {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    // Not GymCourseInformation.details (nested, see ApiPilatesCourseDto) -
    // this is the base tile-level details field the public "Termine" block
    // actually renders (see course-detail.component.html's `tile.details`).
    details: string;
    image: string;
    imageDescription: string;
    courseConfig?: CourseConfig;
    course?: ApiPilatesCourseDto;
}

// Same DI-token pattern as TripTilesApiServiceInterface: interface lives
// here (courses-lib, alongside the components/gym-lib that need it), the
// concrete HTTP-calling implementation lives in sck-app.
@Injectable()
export abstract class CourseTilesApiServiceInterface {
    public abstract getAllCourseTiles(): Observable<ApiCourseTile[]>;
    // Global, once-per-season ski-course prices (see sck-api's
    // /settings/ski-course-pricing) - independent of which A1-F2 tile was
    // clicked, consumed by CourseRegistrationFormComponent's price summary.
    public abstract getSkiCoursePricing(): Observable<SkiCoursePricing>;
}
