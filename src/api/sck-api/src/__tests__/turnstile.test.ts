import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

const { requireTurnstile } = await import('../middleware/turnstile-middleware.js');

const app = express();
app.use(express.json());
app.post('/api/test', requireTurnstile, (_req, res) => res.status(200).json({ ok: true }));

// Jest's node test environment doesn't expose the native `fetch` global as
// an own property, so jest.spyOn(globalThis, 'fetch') fails with "Property
// `fetch` does not exist" - a plain assignment works regardless.
const mockFetch = jest.fn();
(globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;

beforeEach(() => {
  mockFetch.mockReset();
});

const mockFetchOnce = (success: boolean) => {
  mockFetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ success }),
  });
};

describe('requireTurnstile middleware', () => {
  it('lehnt eine Anfrage ohne turnstileToken mit 400 ab, ohne Cloudflare zu kontaktieren', async () => {
    const res = await request(app).post('/api/test').send({});

    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('lässt eine Anfrage mit gültigem Token durch', async () => {
    mockFetchOnce(true);

    const res = await request(app).post('/api/test').send({ turnstileToken: 'valid-token' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('lehnt eine Anfrage ab, wenn Cloudflare den Token als ungültig meldet', async () => {
    mockFetchOnce(false);

    const res = await request(app).post('/api/test').send({ turnstileToken: 'bad-token' });

    expect(res.status).toBe(400);
  });

  it('lehnt die Anfrage ab (statt zu crashen), wenn der Cloudflare-Aufruf selbst fehlschlägt', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));

    const res = await request(app).post('/api/test').send({ turnstileToken: 'irrelevant' });

    expect(res.status).toBe(400);
  });
});
