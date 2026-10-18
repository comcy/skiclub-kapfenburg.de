/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { defineConfig, devices } from '@playwright/test';

// Eigene, schlanke Config - bewusst kein webServer-Block wie in
// e2e/playwright.config.ts, da dieser Test gegen die echte Produktiv-URL
// laeuft, nicht gegen einen lokal gestarteten Dev-Server.
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 1,
    reporter: [['list'], ['github']],
    timeout: 60_000,

    use: {
        trace: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
