/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth-route.js';
import boardingsRoutes from './routes/boardings-route.js';
import courseRegistrationsRoutes from './routes/course-registrations-route.js';
import emailRoutes from './routes/email-route.js';
import imagesRoutes from './routes/images-route.js';
import invitesRoutes from './routes/invites-route.js';
import membersRoutes from './routes/members-route.js';
import newsletterRoutes from './routes/newsletter-route.js';
import newsRoutes from './routes/news-route.js';
import verifiedPersonsRoutes from './routes/verified-persons-route.js';
import registrationRoutes from './routes/registration-route.js';
import membershipRoutes from './routes/membership-route.js';
import sepaExportRoutes from './routes/sepa-export-route.js';
import settingsRoutes from './routes/settings-route.js';
import tilesRoutes from './routes/tiles-route.js';
import tripRegistrationsRoutes from './routes/trip-registrations-route.js';
import usersRoutes from './routes/users-route.js';
import { seedSkiCourseTilesOnce } from './services/ski-course-tiles-seed.js';
import { mediaDir } from './services/upload-service.js';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

const app = express();

// Server laeuft hinter genau einem Reverse-Proxy-Hop (Nginx Proxy Manager).
// Ohne das wirft express-rate-limit (genutzt von publicWriteLimiter auf
// Schreib-/Mail-Routen) einen ERR_ERL_UNEXPECTED_X_FORWARDED_FOR-Fehler,
// sobald NPM den X-Forwarded-For-Header setzt - verhindert dadurch jeden
// Request durch diese Routen (u.a. den Mailversand bei Anmeldungen).
// "1" statt "true": vertraut genau einem Hop, nicht einer beliebigen Kette.
app.set('trust proxy', 1);

app.use(express.json());

// Chrome/Chromium blockt Requests von einer "öffentlichen" Seite auf ein
// Ziel, dessen DNS-Auflösung in den privaten Adressraum zeigt (Private
// Network Access), sofern die Preflight-Antwort nicht explizit erlaubt --
// das npm-Paket "cors" (2.x) unterstuetzt diesen Header nicht nativ, daher
// hier von Hand ergaenzt, bevor cors() selbst die OPTIONS-Antwort sendet.
app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  next();
});
app.use(cors());
app.use('/media', express.static(mediaDir));

app.use('/api', emailRoutes);
app.use('/api', registrationRoutes);
app.use('/api', membershipRoutes);
app.use('/api', tilesRoutes);
app.use('/api', boardingsRoutes);
app.use('/api', imagesRoutes);
app.use('/api', authRoutes);
app.use('/api', invitesRoutes);
app.use('/api', usersRoutes);
app.use('/api', membersRoutes);
app.use('/api', tripRegistrationsRoutes);
app.use('/api', courseRegistrationsRoutes);
app.use('/api', settingsRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', newsRoutes);
app.use('/api', verifiedPersonsRoutes);
app.use('/api', sepaExportRoutes);

try {
  const seeded = seedSkiCourseTilesOnce();
  if (seeded) console.log(`${seeded} Ski-Kurs-Tiles (A1-F2) angelegt.`);
} catch (error) {
  console.error('Seed der Ski-Kurs-Tiles fehlgeschlagen:', error);
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`SMTP Server ${SMTP_SERVER}`);
  console.log(`SMTP Port ${SMTP_PORT}`);
  console.log(`Absender Mail-Adresse ${SENDER_MAIL}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Absender Mail-Password ${SENDER_PW}`);
  }
});
