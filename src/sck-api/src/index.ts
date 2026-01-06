/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import emailRoutes from './routes/email-route.js';
import eventRoutes from './routes/event-route.js';
import gymCourseRoutes from './routes/gym-course-route.js';
import courseRegistrationRoutes from './routes/course-registration-route.js';
import tripRegistrationsRoutes from './routes/trip-registrations-route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', emailRoutes);
app.use('/api', eventRoutes);
app.use('/api', gymCourseRoutes);
app.use('/api', courseRegistrationRoutes);
app.use('/api/trip-registrations', tripRegistrationsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
