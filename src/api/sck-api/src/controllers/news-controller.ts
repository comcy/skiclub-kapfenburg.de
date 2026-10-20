/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { markNewsSeen } from '../services/auth-service.js';
import { getNewsSummary } from '../services/news-service.js';

export const getNews: RequestHandler = (req, res) => {
  try {
    const user = req.user!;
    const canSeeApplications = user.isSuperAdmin || user.permissions.includes('members:manage');
    res.status(200).json(getNewsSummary(user.newsSince, canSeeApplications));
  } catch (error: any) {
    console.error('Fehler beim Laden der Neuigkeiten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Neuigkeiten.' });
  }
};

// "Alles gesehen" - setzt die Basis fuer "neu" auf jetzt.
export const postNewsSeen: RequestHandler = (req, res) => {
  try {
    res.status(200).json({ newsSince: markNewsSeen(req.user!.id) });
  } catch (error: any) {
    console.error('Fehler beim Zuruecksetzen der Neuigkeiten:', error);
    res.status(500).json({ error: 'Fehler beim Zurücksetzen der Neuigkeiten.' });
  }
};
