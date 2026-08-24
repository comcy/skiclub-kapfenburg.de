import express from 'express';
import request from 'supertest';
import { rateLimit } from 'express-rate-limit';

// Doesn't hammer the real routes with the production 20/300 limits (slow,
// brittle) - instead verifies the middleware factory used by
// middleware/rate-limit.ts actually blocks once its own limit is reached,
// using a tiny limit on a throwaway router.
describe('Rate limiting (express-rate-limit wiring)', () => {
  it('allows requests up to the limit, then responds 429 for the same IP', async () => {
    const limiter = rateLimit({
      windowMs: 60_000,
      limit: 2,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
    });

    const app = express();
    app.get('/api/test', limiter, (_req, res) => res.status(200).json({ ok: true }));

    expect((await request(app).get('/api/test')).status).toBe(200);
    expect((await request(app).get('/api/test')).status).toBe(200);

    const blocked = await request(app).get('/api/test');
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ error: 'Zu viele Anfragen. Bitte versuche es später erneut.' });
  });
});
