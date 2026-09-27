/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import multer from 'multer';
import { MemberImportApplyRequest, MemberImportRecord } from '../domain/member-import.js';
import * as membersImportService from '../services/members-import-service.js';

// Memory storage, not disk - the file is parsed once and discarded, no
// reason to leave a copy on disk like the image-upload flow does.
const uploadImportFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'application/json' || file.originalname.toLowerCase().endsWith('.json'));
  },
}).single('file');

export const previewMembersImport: RequestHandler = (req, res) => {
  uploadImportFile(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: 'Datei-Upload fehlgeschlagen. Bitte eine JSON-Datei wählen.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'Keine Datei übermittelt.' });
      return;
    }

    let records: unknown;
    try {
      records = JSON.parse(req.file.buffer.toString('utf8'));
    } catch {
      res.status(400).json({ error: 'Die Datei enthält kein gültiges JSON.' });
      return;
    }
    if (!Array.isArray(records)) {
      res.status(400).json({ error: 'Die JSON-Datei muss ein Array von Mitgliedsdatensätzen enthalten.' });
      return;
    }

    try {
      res.status(200).json(membersImportService.previewImport(records as MemberImportRecord[]));
    } catch (error: any) {
      console.error('Fehler bei der Import-Vorschau:', error);
      res.status(500).json({ error: 'Fehler bei der Import-Vorschau.', details: error.message });
    }
  });
};

export const applyMembersImport: RequestHandler = (req, res) => {
  try {
    const { importId, collisionOverrides } = req.body as MemberImportApplyRequest;
    if (!importId) {
      res.status(400).json({ error: 'importId fehlt.' });
      return;
    }
    res.status(200).json(membersImportService.applyImport(importId, collisionOverrides ?? []));
  } catch (error: any) {
    console.error('Fehler beim Anwenden des Imports:', error);
    res.status(400).json({ error: error.message ?? 'Fehler beim Anwenden des Imports.' });
  }
};
