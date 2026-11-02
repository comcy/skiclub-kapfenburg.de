/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { heartbeat, listOnline } from '../services/presence-service.js';

// Heartbeat der Admin-App (alle ~60 s + bei Seitenwechsel): merkt Zeit und aktuelle Seite der Session und
// liefert direkt die Liste der gerade aktiven Admins zurück. Sichtbar für jeden eingeloggten Admin.
export const postPresence: RequestHandler = (req, res) => {
  const token = (req.headers.authorization || '').slice('Bearer '.length);
  const page = typeof req.body?.page === 'string' ? req.body.page : undefined;
  heartbeat(token, page);
  res.status(200).json({ online: listOnline(), me: req.user?.id });
};
