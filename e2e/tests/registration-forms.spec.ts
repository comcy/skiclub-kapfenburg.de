import { expect, test } from '@playwright/test';

test.describe('Anmeldeformulare verhindern leere Übermittlung', () => {
    const registrationPages = ['/courses/registration', '/trips/registration', '/gymnastik/registration'];

    for (const path of registrationPages) {
        test(`"Absenden" ist ohne Eingaben deaktiviert auf ${path}`, async ({ page }) => {
            await page.goto(path);
            await expect(page.getByRole('button', { name: /Absenden/i })).toBeDisabled();
        });
    }
});
