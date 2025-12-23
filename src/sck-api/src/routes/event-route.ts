/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Router } from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from '../controllers/event-controller.js';

const router = Router();

router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
