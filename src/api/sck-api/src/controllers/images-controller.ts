/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { uploadImage } from '../services/upload-service.js';

// multer does the multipart parsing; we just map its result onto the Image
// shape the admin UI expects. No DB table for images — the file on disk is
// the record, same "just write the file" pattern as registrations.ndjson.
export const handleImageUpload: RequestHandler = (req, res) => {
  uploadImage(req, res, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Hochladen des Bildes.';
      res.status(400).json({ error: message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Kein Bild übermittelt (Feld "image" erwartet).' });
      return;
    }

    res.status(201).json({
      id: randomUUID(),
      filename: req.file.filename,
      filepath: req.file.path,
      url: `/media/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    });
  });
};
