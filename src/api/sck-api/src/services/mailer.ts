/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

export const createMailTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SENDER_MAIL,
      pass: SENDER_PW,
    },
    tls: { rejectUnauthorized: false },
    socketTimeout: 10000,
    connectionTimeout: 10000,
  });
};

export const defaultSender = (): string => SENDER_MAIL;

// Convenience wrapper around createMailTransporter() for simple to/subject/html
// sends (e.g. the admin-app's magic-link mail) - logs instead of failing when
// SMTP isn't configured (local dev), same as the confirmation mails already
// tolerate missing config elsewhere in this service. bcc is optional (used by
// the course/trip confirmation mails' global NotificationBccSetting fallback,
// see *-registration-mail-service.ts) - most callers don't need it.
export const sendMail = async (to: string, subject: string, html: string, bcc?: string): Promise<void> => {
  if (!SMTP_SERVER) {
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const linksBlock = links.length ? `\n🔗 ${links.join('\n🔗 ')}` : '';
    console.log(`[dev] Mail an ${to}${bcc ? ` (BCC: ${bcc})` : ''} (${subject}):${linksBlock}\n${html}`);
    return;
  }

  await createMailTransporter().sendMail({ from: defaultSender(), to, bcc, subject, html });
};
