/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { expect, test } from '@playwright/test';

// Laeuft NICHT gegen einen lokalen Dev-Server (siehe e2e/playwright.config.ts),
// sondern gegen die echte Produktiv-URL - Zweck ist genau das, was ein reiner
// curl-Health-Check nicht pruefen kann: ob ein echter Browser die Seite
// tatsaechlich benutzen kann (CORS/Private-Network-Access-Bloecke treten nur
// im Browser auf, siehe GitHub Issue #207 fuer den Vorfall, der diesen Test
// ausgeloest hat).
const PROD_URL = 'https://www.skiclub-kapfenburg.de';

test('Produktivseite laedt ohne CORS/Private-Network-Fehler und API antwortet strukturell gueltig', async ({ page }) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  // Prueft nur, dass die API erreichbar ist und strukturell gueltig
  // antwortet (Shape { items, total }) - NICHT, dass bereits Tiles
  // angelegt sind. Ob Tiles existieren ist Redaktions-/Admin-Arbeit, kein
  // Verfuegbarkeits-Indikator (siehe #208 - eine leere, aber strukturell
  // gueltige Antwort ist fuer diesen Test ein Erfolg).
  const tilesResponses: { url: string; valid: boolean }[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} -> ${request.failure()?.errorText ?? 'unknown'}`);
  });

  page.on('response', async (response) => {
    if (response.request().method() === 'GET' && /\/api\/tiles\b/.test(response.url())) {
      try {
        const body = await response.json();
        const valid = response.ok() && typeof body === 'object' && body !== null && Array.isArray(body.items);
        tilesResponses.push({ url: response.url(), valid });
      } catch {
        tilesResponses.push({ url: response.url(), valid: false });
      }
    }
  });

  await page.goto(PROD_URL, { waitUntil: 'networkidle', timeout: 30_000 });

  const corsOrPnaConsoleErrors = consoleErrors.filter((msg) =>
    /CORS policy|private network|local address space/i.test(msg),
  );
  expect(corsOrPnaConsoleErrors, `CORS/Private-Network-Fehler in der Konsole:\n${corsOrPnaConsoleErrors.join('\n')}`).toHaveLength(
    0,
  );

  const apiFailures = failedRequests.filter((entry) => entry.includes('sck-api.'));
  expect(apiFailures, `Fehlgeschlagene API-Requests:\n${apiFailures.join('\n')}`).toHaveLength(0);

  expect(tilesResponses.length, 'Keine /api/tiles-Antwort empfangen - API nicht erreicht oder Request blockiert').toBeGreaterThan(
    0,
  );
  const invalidResponses = tilesResponses.filter((r) => !r.valid);
  expect(
    invalidResponses,
    `Strukturell ungültige /api/tiles-Antworten:\n${invalidResponses.map((r) => r.url).join('\n')}`,
  ).toHaveLength(0);
});
