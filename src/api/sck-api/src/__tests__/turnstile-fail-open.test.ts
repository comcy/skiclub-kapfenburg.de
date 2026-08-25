import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Deliberately does NOT set TURNSTILE_SECRET_KEY - this is its own module
// instance (Jest isolates modules per test file), so requireTurnstile's
// isConfigured check evaluates against a genuinely unset env var here,
// exercising the same default state as an environment where no Cloudflare
// account has been set up yet (see turnstile.test.ts for the enforcing
// path once TURNSTILE_SECRET_KEY is set).
const { requireTurnstile } = await import('../middleware/turnstile-middleware.js');

const app = express();
app.use(express.json());
app.post('/api/test', requireTurnstile, (_req, res) => res.status(200).json({ ok: true }));

describe('requireTurnstile middleware (TURNSTILE_SECRET_KEY nicht gesetzt)', () => {
  it('lässt eine Anfrage ohne turnstileToken durch (fail-open, solange kein Cloudflare-Account eingerichtet ist)', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await request(app).post('/api/test').send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
