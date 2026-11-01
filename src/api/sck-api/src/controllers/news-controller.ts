/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { db } from '../db/connection.js';
import { markNewsSeen } from '../services/auth-service.js';
import { getNewsSummary, markTileSeen } from '../services/news-service.js';

export const getNews: RequestHandler = (req, res) => {
  try {
    const user = req.user!;
    const canSeeApplications = user.isSuperAdmin || user.permissions.includes('members:manage');
    res.status(200).json(getNewsSummary(user.id, user.newsSince, canSeeApplications));
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

// Admin hat die Anmeldungs-Liste einer Ausfahrt/eines Kurses geöffnet.
export const postTileSeen: RequestHandler = (req, res) => {
  try {
    const tileId = String(req.params.tileId);
    if (!db.prepare('SELECT 1 FROM tiles WHERE id = ?').get(tileId)) {
      res.status(404).json({ error: 'Nicht gefunden.' });
      return;
    }
    res.status(200).json({ previousSeenAt: markTileSeen(req.user!.id, tileId) });
  } catch (error: any) {
    console.error('Fehler beim Markieren der Liste als gesehen:', error);
    res.status(500).json({ error: 'Fehler beim Markieren als gesehen.' });
  }
};
