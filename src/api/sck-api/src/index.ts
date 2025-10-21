/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import emailRoutes from './routes/email-route.js';
import registrationRoutes from './routes/registration-route.js';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', emailRoutes);
app.use('/api', registrationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`SMTP Server ${SMTP_SERVER}`);
  console.log(`SMTP Port ${SMTP_PORT}`);
  console.log(`Absender Mail-Adresse ${SENDER_MAIL}`);
  console.log(`Absender Mail-Password ${SENDER_PW}`);
});
