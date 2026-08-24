import { expect, test } from '@playwright/test';

// Mocks the sck-api /tiles response so these tests never touch the real
// shared dev database - only the automatic, capacity-derived "Warteliste"
// badge (Runde 2 of the Kapazitäts-Warnung + Warteliste feature) is under
// test here, not backend behavior (that's covered by sck-api's own tests).
const FULL_TRIP_ID = 'e2e-full-trip';
const OPEN_TRIP_ID = 'e2e-open-trip';

const makeTile = (overrides: Record<string, unknown>) => ({
    id: overrides.id,
    order: 0,
    type: 'event',
    title: overrides.title,
    date: '1. Januar 2099',
    subTitle: 'Testfahrt',
    image: 'assets/img/cards/boy.jpg',
    imageDescription: 'Test',
    description: 'Eine Testausfahrt für den E2E-Test.',
    status: 'open',
    expiration: '2099-01-01T00:00:00.000Z',
    behavior: 'view',
    boardings: ['Kapfenburg (7:00 Uhr)'],
    ...overrides,
});

const mockTiles = async (page: import('@playwright/test').Page, items: unknown[]) => {
    await page.route('**/tiles**', (route) => route.fulfill({ json: { items, total: items.length } }));
};

test.describe('Automatisches Warteliste-Badge (Kapazitäts-Warnung + Warteliste, Runde 2)', () => {
    test('zeigt "Warteliste" auf der Startseiten-Kachel, sobald confirmedRegistrationsCount die capacity erreicht', async ({
        page,
    }) => {
        await mockTiles(page, [
            makeTile({
                id: FULL_TRIP_ID,
                title: 'E2E Ausgebuchte Ausfahrt',
                capacity: 1,
                confirmedRegistrationsCount: 1,
            }),
        ]);

        await page.goto('/home');

        const badge = page.locator('.tile-card', { hasText: 'E2E Ausgebuchte Ausfahrt' }).locator('.badge');
        await expect(badge).toHaveText('Warteliste');
        await expect(badge).toHaveClass(/badge-warn/);
    });

    test('zeigt "Plätze frei", solange confirmedRegistrationsCount unter der capacity liegt', async ({ page }) => {
        await mockTiles(page, [
            makeTile({
                id: OPEN_TRIP_ID,
                title: 'E2E Offene Ausfahrt',
                capacity: 10,
                confirmedRegistrationsCount: 3,
            }),
        ]);

        await page.goto('/home');

        const badge = page.locator('.tile-card', { hasText: 'E2E Offene Ausfahrt' }).locator('.badge');
        await expect(badge).toHaveText('Plätze frei');
        await expect(badge).not.toHaveClass(/badge-warn/);
    });

    test('zeigt den "Warteliste"-Stempel auf der Detailseite einer vollen Ausfahrt', async ({ page }) => {
        await mockTiles(page, [
            makeTile({
                id: FULL_TRIP_ID,
                title: 'E2E Ausgebuchte Ausfahrt',
                capacity: 2,
                confirmedRegistrationsCount: 2,
                tripConfig: { pricing: {} },
            }),
        ]);

        await page.goto(`/trips/${FULL_TRIP_ID}`);

        await expect(page.locator('.booked-up-stamp')).toHaveText('Warteliste');
    });

    test('zeigt "Warteliste" in der Ausfahrten-Übersicht, auch ohne manuellen BookedUp-Status', async ({ page }) => {
        await mockTiles(page, [
            makeTile({
                id: FULL_TRIP_ID,
                title: 'E2E Ausgebuchte Ausfahrt',
                capacity: 1,
                confirmedRegistrationsCount: 1,
                tripConfig: { pricing: {} },
            }),
        ]);

        await page.goto('/trips/overview');

        const card = page.locator('.trip-card', { hasText: 'E2E Ausgebuchte Ausfahrt' });
        await expect(card.locator('.badge')).toHaveText('Warteliste');
        await expect(card.locator('a', { hasText: 'Warteliste' })).toBeVisible();
    });
});
