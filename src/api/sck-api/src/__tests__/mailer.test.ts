import { jest } from '@jest/globals';

// mailer.ts reads SMTP_SERVER once at module load time (a plain top-level
// const, see mailer.ts) - each case here needs its own fresh module
// instance with the env var set beforehand, same jest.resetModules() +
// dynamic import pattern already used elsewhere in this suite for the same
// reason (see trip-registrations.test.ts).
describe('sendMail', () => {
  const originalSmtpServer = process.env.SMTP_SERVER;

  afterEach(() => {
    process.env.SMTP_SERVER = originalSmtpServer;
    jest.resetModules();
  });

  it('returns false and never touches nodemailer when SMTP_SERVER is unset (dev-log fallback)', async () => {
    delete process.env.SMTP_SERVER;
    jest.resetModules();
    const mockedCreateTransport = jest.fn();
    jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: mockedCreateTransport } }));

    const { sendMail } = await import('../services/mailer.js');
    const sent = await sendMail('to@test.com', 'Subject', '<p>Body</p>');

    expect(sent).toBe(false);
    expect(mockedCreateTransport).not.toHaveBeenCalled();
  });

  it('returns true and actually sends via nodemailer when SMTP_SERVER is configured', async () => {
    process.env.SMTP_SERVER = 'smtp.test.local';
    jest.resetModules();
    const mockedSendMail = jest.fn().mockResolvedValue(undefined);
    const mockedCreateTransport = jest.fn().mockReturnValue({ sendMail: mockedSendMail });
    jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: mockedCreateTransport } }));

    const { sendMail } = await import('../services/mailer.js');
    const sent = await sendMail('to@test.com', 'Subject', '<p>Body</p>');

    expect(sent).toBe(true);
    expect(mockedSendMail).toHaveBeenCalledTimes(1);
  });
});
