/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth-route.js';
import boardingsRoutes from './routes/boardings-route.js';
import emailRoutes from './routes/email-route.js';
import imagesRoutes from './routes/images-route.js';
import invitesRoutes from './routes/invites-route.js';
import registrationRoutes from './routes/registration-route.js';
import sepaRoutes from './routes/sepa-route.js';
import tilesRoutes from './routes/tiles-route.js';
import usersRoutes from './routes/users-route.js';
import { mediaDir } from './services/upload-service.js';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/media', express.static(mediaDir));

app.use('/api', emailRoutes);
app.use('/api', registrationRoutes);
app.use('/api', tilesRoutes);
app.use('/api', boardingsRoutes);
app.use('/api', imagesRoutes);
app.use('/api', authRoutes);
app.use('/api', invitesRoutes);
app.use('/api', usersRoutes);
app.use('/api', sepaRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`SMTP Server ${SMTP_SERVER}`);
  console.log(`SMTP Port ${SMTP_PORT}`);
  console.log(`Absender Mail-Adresse ${SENDER_MAIL}`);
  console.log(`Absender Mail-Password ${SENDER_PW}`);
});
