/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { deleteImage, listImages, uploadImage } from '../services/upload-service.js';

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

    // id === filename (no DB row to hand out a real id from) - matters
    // because tile.imageId round-trips this value, and listImages()/
    // deleteImage() below key off the filename too, so it has to be the
    // same value everywhere or a tile's stored imageId would point at
    // nothing.
    res.status(201).json({
      id: req.file.filename,
      filename: req.file.filename,
      filepath: req.file.path,
      url: `/media/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    });
  });
};

export const listUploadedImages: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(listImages());
  } catch (error: any) {
    console.error('Fehler beim Laden der Bilder:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Bilder.', details: error.message });
  }
};

export const handleImageDelete: RequestHandler = (req, res) => {
  try {
    const deleted = deleteImage(String(req.params.filename));
    if (!deleted) {
      res.status(404).json({ error: 'Bild nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des Bildes:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Bildes.', details: error.message });
  }
};
