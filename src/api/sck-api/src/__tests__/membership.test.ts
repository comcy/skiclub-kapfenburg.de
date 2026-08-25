import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

process.env.SEPA_ENCRYPTION_KEY = '0'.repeat(64);
// requireTurnstile fails open unless this is set (see turnstile-middleware.ts).
process.env.TURNSTILE_SECRET_KEY = 'test-secret';

const mockedSaveData = jest.fn();
const mockedSaveSepaData = jest.fn();
const mockedSendMail = jest.fn();
const mockedCreateTransport = jest.fn();
// requireTurnstile now gates this route - Jest's node test environment
// doesn't expose native `fetch` as an own property, so
// jest.spyOn(globalThis, 'fetch') fails; assign a mock directly instead.
const mockFetch = jest.fn();
(globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;

jest.unstable_mockModule('../services/data-service', () => ({
  saveData: mockedSaveData,
  saveSepaData: mockedSaveSepaData,
}));

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: mockedCreateTransport,
  },
}));

const { default: membershipRoutes } = await import('../routes/membership-route');

const app = express();
app.use(express.json());
app.use('/api', membershipRoutes);

const validRegistration = {
  firstName: 'Max',
  lastName: 'Mustermann',
  birthday: '2000-01-01',
  address: 'Musterstraße 1, 12345 Musterstadt',
  email: 'max@test.com',
  phone: '0123456789',
  isFamilyMembership: true,
  familyMembers: [{ firstName: 'Erika', lastName: 'Mustermann', birthday: '2002-02-02' }],
  iban: 'DE89370400440532013000',
  sepaMandateAccepted: true,
  termsAccepted: true,
  privacyAccepted: true,
  turnstileToken: 'test-token',
};

describe('Membership Routes', () => {
  beforeEach(() => {
    mockedSaveData.mockClear();
    mockedSaveSepaData.mockClear();
    mockedSendMail.mockClear();
    mockedCreateTransport.mockClear();
    mockedSaveData.mockResolvedValue(undefined);
    mockedSaveSepaData.mockResolvedValue(undefined);
    mockedSendMail.mockResolvedValue({ messageId: 'test-message-id' });
    mockedCreateTransport.mockReturnValue({ sendMail: mockedSendMail });
    // requireTurnstile now gates this route - mock Cloudflare's verify call
    // (see turnstile.test.ts for dedicated middleware coverage). Jest's node
    // test environment doesn't expose native `fetch` as an own property, so
    // jest.spyOn(globalThis, 'fetch') fails - assign directly.
    mockFetch.mockReset().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('POST /api/membership/register - lehnt eine Anfrage ohne turnstileToken ab, bevor der Controller läuft', async () => {
    const { turnstileToken, ...withoutToken } = validRegistration;
    void turnstileToken;

    const response = await request(app).post('/api/membership/register').send(withoutToken);

    expect(response.status).toBe(400);
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/membership/register - sollte einen Antrag speichern, IBAN verschlüsselt getrennt ablegen und zwei E-Mails versenden', async () => {
    const response = await request(app).post('/api/membership/register').send(validRegistration);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Mitgliedsantrag erfolgreich gespeichert.');
    expect(response.body.registrationId).toBeDefined();
    // IBAN darf in keiner Form in der Response landen
    expect(JSON.stringify(response.body)).not.toContain('DE89370400440532013000');

    // Registrierungsdaten ohne IBAN gespeichert
    expect(mockedSaveData).toHaveBeenCalledTimes(1);
    const [type, savedData] = mockedSaveData.mock.calls[0] as [string, any];
    expect(type).toBe('membership-registration');
    expect(savedData.iban).toBeUndefined();
    expect(savedData.firstName).toBe('Max');

    // SEPA-Daten getrennt und verschlüsselt gespeichert
    expect(mockedSaveSepaData).toHaveBeenCalledTimes(1);
    const [sepaRecord] = mockedSaveSepaData.mock.calls[0] as [any];
    expect(sepaRecord.registrationId).toBe(savedData.registrationId);
    expect(sepaRecord.ibanEncrypted).toBeDefined();
    expect(sepaRecord.ibanEncrypted).not.toContain('DE89370400440532013000');

    // Zwei E-Mails: Antragsteller + Vorstand/Kassenwart
    expect(mockedSendMail).toHaveBeenCalledTimes(2);
    const applicantMail = mockedSendMail.mock.calls[0][0] as any;
    const boardMail = mockedSendMail.mock.calls[1][0] as any;
    expect(applicantMail.to).toBe('max@test.com');
    expect(boardMail.to).toContain('registration@skiclub-kapfenburg.de');

    // IBAN taucht in der Vorstandsmail nicht im Klartext auf
    expect(boardMail.html).not.toContain('DE89370400440532013000');
  });

  it('POST /api/membership/register - sollte auch ohne weitere Familienmitglieder funktionieren', async () => {
    const response = await request(app)
      .post('/api/membership/register')
      .send({ ...validRegistration, isFamilyMembership: false, familyMembers: [] });

    expect(response.status).toBe(201);
    expect(mockedSaveData).toHaveBeenCalledTimes(1);
  });

  it('POST /api/membership/register - sollte einen Fehler zurückgeben, wenn Pflichtfelder fehlen', async () => {
    const response = await request(app)
      .post('/api/membership/register')
      .send({ firstName: 'Max', turnstileToken: 'test-token' });

    expect(response.status).toBe(400);
    expect(mockedSaveData).not.toHaveBeenCalled();
    expect(mockedSaveSepaData).not.toHaveBeenCalled();
  });

  it('POST /api/membership/register - sollte einen Fehler zurückgeben, wenn das SEPA-Mandat nicht erteilt wurde', async () => {
    const response = await request(app)
      .post('/api/membership/register')
      .send({ ...validRegistration, sepaMandateAccepted: false });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Lastschriftmandat');
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/membership/register - sollte einen Fehler zurückgeben, wenn die IBAN ungültig ist', async () => {
    const response = await request(app)
      .post('/api/membership/register')
      .send({ ...validRegistration, iban: 'not-an-iban' });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('IBAN');
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('POST /api/membership/register - sollte trotz fehlgeschlagenem Mailversand erfolgreich speichern (Best-Effort)', async () => {
    mockedSendMail.mockRejectedValue(new Error('SMTP down'));

    const response = await request(app).post('/api/membership/register').send(validRegistration);

    expect(response.status).toBe(201);
    expect(mockedSaveData).toHaveBeenCalledTimes(1);
    expect(mockedSaveSepaData).toHaveBeenCalledTimes(1);
  });

  it('POST /api/membership/register - sollte einen 500-Fehler zurückgeben, wenn das Speichern fehlschlägt', async () => {
    mockedSaveData.mockRejectedValue(new Error('Speicherfehler'));

    const response = await request(app).post('/api/membership/register').send(validRegistration);

    expect(response.status).toBe(500);
    expect(mockedSendMail).not.toHaveBeenCalled();
  });
});
