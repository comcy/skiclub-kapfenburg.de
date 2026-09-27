import { test as base, expect } from '@playwright/test';

// app.component.ts (the app shell, wrapping every route) fires the first
// two settings requests below on every single page load, regardless of
// route; /trips-pricing and /ski-course-pricing fire whenever a route
// injects TripTilesApiServiceInterface/CourseTilesApiServiceInterface
// (home, /trips/*, /courses, /gymnastik/:id) - between the two, most of
// this suite's pages touch at least one. All of sck-app's dev-mode
// environment.ts (used by this suite's own `ng serve` webServer) points
// these at sck-api.5i1f4ng.de, a real, personal remote backend - fine from
// a fast/local connection, but a CI runner's network to that one host can
// be slow/unreachable enough to blow tests' tight assertion timeouts (see
// the commit this file was added in).
//
// /tiles is mocked empty for the same reason, plus a second one: several
// specs assert on the static content (TRIP_DATA/COURSE_LEVEL_TILES/
// COURSE_DATA) that only shows when there's nothing from the admin-managed
// side to merge in or add - real admin tiles on the shared remote backend
// (which will keep growing over time, e.g. #183) would otherwise make
// those assertions increasingly flaky/wrong for reasons that have nothing
// to do with a real regression. Every affected page already merges over a
// static fallback rather than requiring API data, so this is safe
// everywhere in this suite; any spec that genuinely needs specific tile
// content still sets up its own more specific `page.route('**/tiles**',
// ...)` - registered after this fixture's, so it correctly wins for that
// pattern.
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/settings/notification-bcc', (route) => route.fulfill({ json: { customBccList: [] } }));
        await page.route('**/settings/mail-templates', (route) => route.fulfill({ json: {} }));
        await page.route('**/settings/trip-pricing', (route) => route.fulfill({ json: {} }));
        await page.route('**/settings/ski-course-pricing', (route) => route.fulfill({ json: {} }));
        await page.route('**/tiles**', (route) => route.fulfill({ json: { items: [], total: 0 } }));
        await use(page);
    },
});

export { expect };
