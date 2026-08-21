import { expect, test } from '@playwright/test';

test.describe('Anmeldeformulare verhindern leere Übermittlung', () => {
    const registrationPages = ['/trips/registration'];

    for (const path of registrationPages) {
        test(`"Absenden" ist ohne Eingaben deaktiviert auf ${path}`, async ({ page }) => {
            await page.goto(path);
            await expect(page.getByRole('button', { name: /Absenden/i })).toBeDisabled();
        });
    }

    test('"Absenden" ist ohne Eingaben deaktiviert auf /courses (nach Kachel-Klick)', async ({ page }) => {
        await page.goto('/courses');
        await page.getByRole('button', { name: 'Jetzt anmelden' }).first().click();
        await expect(page.getByRole('button', { name: /Absenden/i })).toBeDisabled();
    });

    test('"Absenden" ist ohne Eingaben deaktiviert auf /gymnastik/pilates-thu (nach Anmelden-Klick)', async ({
        page,
    }) => {
        await page.goto('/gymnastik/pilates-thu');
        await page.getByRole('button', { name: 'Jetzt anmelden' }).click();
        await expect(page.getByRole('button', { name: /Absenden/i })).toBeDisabled();
    });
});
