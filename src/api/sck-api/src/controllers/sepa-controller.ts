/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { db } from '../db/connection.js';

// Table is owned by the parallel membership/SEPA feature and stays empty
// here; this route exists so the 'sepa:read' permission gate has something
// real to protect (see FEATURE_BRIEF.md verification step).
export const listSepaData: RequestHandler = (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM sepa_data ORDER BY created_at DESC').all();
    res.status(200).json(rows);
  } catch (error: any) {
    console.error('Fehler beim Laden der SEPA-Daten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der SEPA-Daten.', details: error.message });
  }
};
