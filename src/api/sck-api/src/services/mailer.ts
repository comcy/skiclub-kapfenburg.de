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
