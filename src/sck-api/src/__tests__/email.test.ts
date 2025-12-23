/*
import request from 'supertest';
import express from 'express';
import emailRoutes from '../routes/email-route';
import { saveData } from '../services/data-service';
import nodemailer from 'nodemailer';

jest.mock('../services/data-service');
jest.mock('nodemailer');

const app = express();
app.use(express.json());
app.use('/api', emailRoutes);

describe('Email Routes', () => {
  const mockedSaveData = saveData as jest.Mock;
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

  beforeEach(() => {
    mockedSaveData.mockClear();
    const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockedNodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock } as any);
  });

  it('POST /api/send_email - sollte eine E-Mail erfolgreich senden und die Daten speichern', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body'
    };

    mockedSaveData.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/send_email')
      .send(emailData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('E-Mail erfolgreich gesendet');
    expect(mockedSaveData).toHaveBeenCalledWith('email-contact', emailData);
    expect(mockedNodemailer.createTransport).toHaveBeenCalled();
    expect(mockedNodemailer.createTransport().sendMail).toHaveBeenCalled();
  });

  it('POST /api/send_email - sollte einen Fehler zurückgeben, wenn der Empfänger ungültig ist', async () => {
    const emailData = {
      to: 'invalid-email',
      subject: 'Test Subject',
      text: 'Test Body'
    };

    const response = await request(app)
      .post('/api/send_email')
      .send(emailData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ungültige Empfänger-E-Mail-Adresse.');
    expect(mockedSaveData).toHaveBeenCalledWith('email-contact', emailData);
    expect(mockedNodemailer.createTransport().sendMail).not.toHaveBeenCalled();
  });
});
*/
