import { expect, test } from '@playwright/test';

test.describe('Sektionen mit Tabs leiten auf ihren Standard-Tab um', () => {
    const cases: Array<{ from: string; to: string }> = [
        { from: '/trips', to: '/trips/registration' },
        { from: '/courses', to: '/courses/information' },
        { from: '/gymnastik', to: '/gymnastik/information' },
    ];

    for (const { from, to } of cases) {
        test(`${from} -> ${to}`, async ({ page }) => {
            await page.goto(from);
            await expect(page).toHaveURL(new RegExp(`${to}$`));
        });
    }
});

test.describe('Wechsel zwischen Tabs', () => {
    test('Kurse: Information -> Anmeldung', async ({ page }) => {
        await page.goto('/courses/information');
        await page.getByRole('tab', { name: 'Anmeldung' }).click();
        await page.waitForURL('**/courses/registration');
    });

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
