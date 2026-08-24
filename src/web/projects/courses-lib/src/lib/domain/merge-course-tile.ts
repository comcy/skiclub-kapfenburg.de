/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CourseTile, InfoTile, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { ApiCourseTile } from '../api/course-tiles-api.interface';

const nonEmpty = (value: string | undefined): value is string => !!value && value.trim().length > 0;
const NEW_TILE_PLACEHOLDER_TITLE = 'New Tile';

/**
 * Merges an admin-managed course tile (from CourseTilesApiServiceInterface)
 * over the static fallback tile - a field only wins if the admin actually
 * set it (non-empty), so a freshly-created tile with just a BCC list
 * doesn't blank out the static content. Used at every place ski-level or
 * Pilates content is displayed (courses.component.ts, gym-lib's
 * course-detail.component.ts, routing-dialog.component.ts, home.component.ts).
 */
export function mergeCourseTile<T extends CourseTile | InfoTile>(staticTile: T, apiTile: ApiCourseTile | undefined): T {
    if (!apiTile) return staticTile;

    const merged: T = {
        ...staticTile,
        title:
            nonEmpty(apiTile.title) && apiTile.title !== NEW_TILE_PLACEHOLDER_TITLE ? apiTile.title : staticTile.title,
        subTitle: nonEmpty(apiTile.subTitle) ? apiTile.subTitle : staticTile.subTitle,
        description: nonEmpty(apiTile.description) ? apiTile.description : staticTile.description,
        details: nonEmpty(apiTile.details) ? apiTile.details : staticTile.details,
        image: nonEmpty(apiTile.image) ? apiTile.image : staticTile.image,
        imageDescription: nonEmpty(apiTile.imageDescription) ? apiTile.imageDescription : staticTile.imageDescription,
    };

    if (merged.type === TileType.Course && apiTile.course) {
        const staticCourse = (staticTile as CourseTile).course;
        const apiCourse = apiTile.course;
        (merged as CourseTile).course = {
            ...staticCourse,
            // description/details stay in sync with the tile's own fields
            // above (single source of truth, matching how the static data
            // already duplicates the same text into both places) - never
            // edited separately in the admin editor.
            description: merged.description,
            details: merged.details,
            time: nonEmpty(apiCourse.time) ? apiCourse.time : staticCourse.time,
            location: nonEmpty(apiCourse.location) ? apiCourse.location : staticCourse.location,
            contact: nonEmpty(apiCourse.contact) ? apiCourse.contact : staticCourse.contact,
            date: nonEmpty(apiCourse.date) ? apiCourse.date : staticCourse.date,
            prices: apiCourse.prices
                ? {
                      member: nonEmpty(apiCourse.prices.member)
                          ? apiCourse.prices.member
                          : (staticCourse.prices?.member ?? ''),
                      nonMember: nonEmpty(apiCourse.prices.nonMember)
                          ? apiCourse.prices.nonMember
                          : (staticCourse.prices?.nonMember ?? ''),
                  }
                : staticCourse.prices,
            schedule: apiCourse.schedule
                ? {
                      weekday: apiCourse.schedule.weekday,
                      startDate: new Date(apiCourse.schedule.startDate),
                      endDate: new Date(apiCourse.schedule.endDate),
                      excludedDates: apiCourse.schedule.excludedDates?.map((date) => new Date(date)),
                  }
                : staticCourse.schedule,
            customBccList: apiTile.courseConfig?.customBccList,
        };
    }

    return merged;
}
