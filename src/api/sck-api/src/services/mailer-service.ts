/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

// Same transporter setup as email-controller.ts's sendEmail — kept separate
// rather than importing that HTTP handler, since it isn't a reusable "send
// this mail" function on its own.
export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
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

  await transporter.sendMail({ from: SENDER_MAIL, to, subject, html });
};
