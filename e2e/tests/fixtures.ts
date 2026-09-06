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
// the commit this file was added in). None of their actual content
// affects any assertion in this suite, so mocking them globally here is
// safe; any spec that cares about specific *tile* data still sets up its
// own `page.route('**/tiles**', ...)` - registered after this fixture's
// routes, so it correctly takes priority for that pattern.
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/settings/notification-bcc', (route) => route.fulfill({ json: { customBccList: [] } }));
        await page.route('**/settings/mail-templates', (route) => route.fulfill({ json: {} }));
        await page.route('**/settings/trip-pricing', (route) => route.fulfill({ json: {} }));
        await page.route('**/settings/ski-course-pricing', (route) => route.fulfill({ json: {} }));
        await use(page);
    },
});

export { expect };
