import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockedSaveData = jest.fn();
const mockedCreateTransport = jest.fn();

jest.unstable_mockModule('../services/data-service', () => ({
  saveData: mockedSaveData,
}));

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: mockedCreateTransport,
  },
}));

const { default: emailRoutes } = await import('../routes/email-route');

const app = express();
app.use(express.json());
app.use('/api', emailRoutes);

describe('Email Routes', () => {
  beforeEach(() => {
    mockedSaveData.mockClear();
    const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockedCreateTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  it('POST /api/send_email - sollte eine E-Mail erfolgreich senden und die Daten speichern', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    };

    mockedSaveData.mockResolvedValue(undefined);

    const response = await request(app).post('/api/send_email').send(emailData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('E-Mail erfolgreich gesendet');
    expect(mockedSaveData).toHaveBeenCalledWith('email-contact', emailData);
    expect(mockedCreateTransport).toHaveBeenCalled();
    expect(mockedCreateTransport().sendMail).toHaveBeenCalled();
  });

  it('POST /api/send_email - ignoriert ein vom Client mitgeschicktes "from" (kein offenes Mail-Relay)', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
      from: 'angeblicher-vorstand@skiclub-kapfenburg.de',
    };

    mockedSaveData.mockResolvedValue(undefined);

    const response = await request(app).post('/api/send_email').send(emailData);

    expect(response.status).toBe(200);
    const sentMailOptions = mockedCreateTransport().sendMail.mock.calls[0][0] as { from: string };
    expect(sentMailOptions.from).not.toBe('angeblicher-vorstand@skiclub-kapfenburg.de');
    // No SENDER_MAIL env var in the test environment -> defaultSender() is ''.
    expect(sentMailOptions.from).toBe('');
  });

  it('POST /api/send_email - Fehlerantwort enthaelt keine internen Fehlerdetails', async () => {
    mockedCreateTransport.mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(new Error('SMTP down')),
    });

    const response = await request(app)
      .post('/api/send_email')
      .send({ to: 'test@example.com', subject: 'Test', text: 'Test' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Fehler beim Senden der E-Mail' });
  });

  it('POST /api/send_email - sollte einen Fehler zurückgeben, wenn der Empfänger ungültig ist', async () => {
    const emailData = {
      to: 'invalid-email',
      subject: 'Test Subject',
      text: 'Test Body',
    };

    const response = await request(app).post('/api/send_email').send(emailData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ungültige Empfänger-E-Mail-Adresse.');
    expect(mockedSaveData).toHaveBeenCalledWith('email-contact', emailData);
    expect(mockedCreateTransport().sendMail).not.toHaveBeenCalled();
  });
});
