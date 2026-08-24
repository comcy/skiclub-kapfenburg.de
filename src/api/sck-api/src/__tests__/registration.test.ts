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

    const response = await request(app).post('/api/register').send(registrationData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registrierung erfolgreich gespeichert.');
    expect(mockedSaveData).toHaveBeenCalledWith('course-registration', registrationData);
    // The publicWriteLimiter is wired to this route (see routes/registration-route.ts).
    expect(response.headers['ratelimit-limit']).toBeDefined();
  });

  it('POST /api/register - sollte einen Fehler zurückgeben, wenn Felder fehlen', async () => {
    const registrationData = {
      firstName: 'Max',
    };

    const response = await request(app).post('/api/register').send(registrationData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Vorname, Nachname und E-Mail sind erforderlich.');
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/register - sollte einen 500-Fehler zurückgeben, wenn das Speichern fehlschlägt', async () => {
    const registrationData = {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@test.com',
      birthday: '2000-01-01',
    };

    mockedSaveData.mockRejectedValue(new Error('Speicherfehler'));

    const response = await request(app).post('/api/register').send(registrationData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Fehler bei der Verarbeitung Ihrer Anfrage.' });
  });
});
