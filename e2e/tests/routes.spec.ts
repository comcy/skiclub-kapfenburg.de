import { expect, test } from '@playwright/test';

test.describe('Sektionen mit Tabs leiten auf ihren Standard-Tab um', () => {
    const cases: Array<{ from: string; to: string }> = [{ from: '/trips', to: '/trips/overview' }];

    for (const { from, to } of cases) {
        test(`${from} -> ${to}`, async ({ page }) => {
            await page.goto(from);
            await expect(page).toHaveURL(new RegExp(`${to}$`));
        });
    }
});

test.describe('Kurse und Gymnastik sind einzelne Seiten ohne Tabs', () => {
    test('Kurse: /courses zeigt Könnerstufen-Kacheln', async ({ page }) => {
        await page.goto('/courses');
        await expect(page.getByText('A1 – Anfänger Basis')).toBeVisible();
        await expect(page.getByRole('tab')).toHaveCount(0);
    });

    test('Gymnastik: /gymnastik zeigt Pilates-Kacheln', async ({ page }) => {
        await page.goto('/gymnastik');
        await expect(page.getByText('Pilates (Donnerstags)')).toBeVisible();
        await expect(page.getByRole('tab')).toHaveCount(0);
    });
});

test.describe('Wechsel zwischen Tabs', () => {
    test('Ausfahrten: Anmeldung -> Information', async ({ page }) => {
        await page.goto('/trips/registration');
        await page.getByRole('tab', { name: 'Information' }).click();
        await page.waitForURL('**/trips/information');
    });
});

test('Skilift-Info-Seite zeigt Öffnungszeiten und Preise', async ({ page }) => {
    await page.goto('/skilift');
    await expect(page.getByText('Öffnungszeiten')).toBeVisible();
    await expect(page.getByText('Preise')).toBeVisible();
});
