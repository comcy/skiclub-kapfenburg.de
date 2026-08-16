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
