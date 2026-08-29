/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { SepaExportRequestBody, SepaSequenceType } from '../domain/sepa-export.js';
import * as sepaExportService from '../services/sepa-export-service.js';

const isSequenceType = (value: unknown): value is SepaSequenceType => value === 'FRST' || value === 'RCUR';

export const listSepaExportCandidates: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(sepaExportService.listExportCandidates());
  } catch (error: any) {
    console.error('Fehler beim Laden der SEPA-Export-Kandidaten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der SEPA-Export-Kandidaten.' });
  }
};

export const previewSepaExport: RequestHandler = (req, res) => {
  try {
    const { memberIds } = req.body as SepaExportRequestBody;
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      res.status(400).json({ error: 'Bitte mindestens ein Mitglied auswählen.' });
      return;
    }
    res.status(200).json(sepaExportService.computePreview(memberIds));
  } catch (error: any) {
    console.error('Fehler bei der SEPA-Export-Vorschau:', error);
    res.status(500).json({ error: 'Fehler bei der SEPA-Export-Vorschau.' });
  }
};

export const generateSepaExport: RequestHandler = (req, res) => {
  try {
    const { memberIds, executionDate, sequenceType } = req.body as SepaExportRequestBody;
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      res.status(400).json({ error: 'Bitte mindestens ein Mitglied auswählen.' });
      return;
    }
    if (!executionDate) {
      res.status(400).json({ error: 'Fälligkeitsdatum fehlt.' });
      return;
    }
    if (!isSequenceType(sequenceType)) {
      res.status(400).json({ error: 'sequenceType muss FRST oder RCUR sein.' });
      return;
    }

    const xml = sepaExportService.generatePain008(memberIds, executionDate, sequenceType);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="sepa-lastschrift-${executionDate}.xml"`);
    res.status(200).send(xml);
  } catch (error: any) {
    console.error('Fehler beim Generieren des SEPA-Exports:', error);
    res.status(400).json({ error: error.message ?? 'Fehler beim Generieren des SEPA-Exports.' });
  }
};
