import { expect, test } from '@playwright/test';

test.describe('Hauptnavigation', () => {
    test('Startseite lädt mit Titel und Navigationsleiste', async ({ page }) => {
        await page.goto('/home');
        await expect(page).toHaveTitle('Skiclub Kapfenburg e.V.');
        await expect(page.locator('.navitems-container')).toBeVisible();
    });

    test('unbekannte Route leitet auf die Startseite um', async ({ page }) => {
        await page.goto('/does-not-exist');
        await expect(page).toHaveURL(/\/home$/);
    });

    test.describe('Klick auf Navigationslink führt zur jeweiligen Sektion', () => {
        const sections: Array<{ name: string; urlPart: string }> = [
            { name: 'Ski- und Snowboardschule', urlPart: '/courses' },
            { name: 'Ausfahrten', urlPart: '/trips' },
            { name: 'Gymnastik', urlPart: '/gymnastik' },
            { name: 'Skilift', urlPart: '/skilift' },
        ];

        for (const section of sections) {
            test(`"${section.name}"`, async ({ page }) => {
                await page.goto('/home');
                await page.locator('.navitems-container a', { hasText: section.name }).click();
                await page.waitForURL(`**${section.urlPart}**`);
                await expect(page).toHaveURL(new RegExp(section.urlPart.replace('/', '\\/')));
            });
        }
    });

    test('Footer-Links führen zu Impressum und Datenschutz', async ({ page }) => {
        await page.goto('/home');

        await page.locator('#footer a', { hasText: 'Impressum' }).click();
        await page.waitForURL('**/impressum');
        await expect(page.locator('#impressum')).toBeVisible();

        await page.goto('/home');
        await page.locator('#footer a', { hasText: 'Datenschutz' }).click();
        await page.waitForURL('**/datenschutz');
        await expect(page.getByText('Datenschutzerklärung', { exact: true })).toBeVisible();
    });
});
