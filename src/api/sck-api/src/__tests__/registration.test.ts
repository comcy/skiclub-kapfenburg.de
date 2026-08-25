import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockedSaveData = jest.fn();

jest.unstable_mockModule('../services/data-service', () => ({
  saveData: mockedSaveData,
}));

const { default: registrationRoutes } = await import('../routes/registration-route');

const app = express();
app.use(express.json());
app.use('/api', registrationRoutes);

// requireTurnstile now gates this route (see routes/registration-route.ts) -
// mock Cloudflare's verify call so these tests keep exercising the
// controller's own behavior, not the Turnstile check (that's covered by
// turnstile.test.ts).
const turnstileToken = 'test-token';
// Jest's node test environment doesn't expose native `fetch` as an own
// property, so jest.spyOn(globalThis, 'fetch') fails - assign directly.
const mockFetch = jest.fn();
(globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;
beforeEach(() => {
  mockFetch.mockReset().mockResolvedValue({
    json: () => Promise.resolve({ success: true }),
  });
});

describe('Registration Routes', () => {
  beforeEach(() => {
    mockedSaveData.mockClear();
  });

  it('POST /api/register - sollte eine Registrierung erfolgreich speichern', async () => {
    const registrationData = {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@test.com',
      birthday: '2000-01-01',
    };

    mockedSaveData.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/register')
      .send({ ...registrationData, turnstileToken });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registrierung erfolgreich gespeichert.');
    // requireTurnstile strips turnstileToken before the controller runs.
    expect(mockedSaveData).toHaveBeenCalledWith('course-registration', registrationData);
    // The publicWriteLimiter is wired to this route (see routes/registration-route.ts).
    expect(response.headers['ratelimit-limit']).toBeDefined();
  });

  it('POST /api/register - sollte einen Fehler zurückgeben, wenn Felder fehlen', async () => {
    const registrationData = {
      firstName: 'Max',
      turnstileToken,
    };

    const response = await request(app).post('/api/register').send(registrationData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Vorname, Nachname und E-Mail sind erforderlich.');
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/register - lehnt eine Anfrage ohne turnstileToken ab, bevor der Controller läuft', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ firstName: 'Max', lastName: 'Mustermann', email: 'max@test.com', birthday: '2000-01-01' });

    expect(response.status).toBe(400);
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/register - sollte einen 500-Fehler zurückgeben, wenn das Speichern fehlschlägt', async () => {
    const registrationData = {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@test.com',
      birthday: '2000-01-01',
      turnstileToken,
    };

    mockedSaveData.mockRejectedValue(new Error('Speicherfehler'));

    const response = await request(app).post('/api/register').send(registrationData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Fehler bei der Verarbeitung Ihrer Anfrage.' });
  });
});
