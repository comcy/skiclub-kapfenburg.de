/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { BoardingCreationParams } from '../domain/boarding.js';
import * as boardingsService from '../services/boardings-service.js';

const isUniqueConstraintError = (error: any): boolean => String(error?.message ?? '').includes('UNIQUE constraint');

export const listBoardings: RequestHandler = (req, res) => {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
    const limit = parseInt(String(req.query.limit ?? '100'), 10) || 100;
    res.status(200).json(boardingsService.listBoardings(page, limit));
  } catch (error: any) {
    console.error('Fehler beim Laden der Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Boardings.', details: error.message });
  }
};

export const getBoarding: RequestHandler = (req, res) => {
  try {
    const boarding = boardingsService.getBoarding(String(req.params.id));
    if (!boarding) {
      res.status(404).json({ error: 'Boarding nicht gefunden.' });
      return;
    }
    res.status(200).json(boarding);
  } catch (error: any) {
    console.error('Fehler beim Laden des Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Boardings.', details: error.message });
  }
};

export const createBoarding: RequestHandler = (req, res) => {
  try {
    const body = req.body as BoardingCreationParams;
    if (!body.name || !body.name.trim()) {
      res.status(400).json({ error: 'Name ist erforderlich.' });
      return;
    }
    res.status(201).json(boardingsService.createBoarding(body));
  } catch (error: any) {
    if (isUniqueConstraintError(error)) {
      res.status(409).json({ error: 'Ein Boarding mit diesem Namen existiert bereits.' });
      return;
    }
    console.error('Fehler beim Erstellen des Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Boardings.', details: error.message });
  }
};

export const updateBoarding: RequestHandler = (req, res) => {
  try {
    const body = req.body as BoardingCreationParams;
    if (!body.name || !body.name.trim()) {
      res.status(400).json({ error: 'Name ist erforderlich.' });
      return;
    }
    const boarding = boardingsService.updateBoarding(String(req.params.id), body);
    if (!boarding) {
      res.status(404).json({ error: 'Boarding nicht gefunden.' });
      return;
    }
    res.status(200).json(boarding);
  } catch (error: any) {
    if (isUniqueConstraintError(error)) {
      res.status(409).json({ error: 'Ein Boarding mit diesem Namen existiert bereits.' });
      return;
    }
    console.error('Fehler beim Aktualisieren des Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Boardings.', details: error.message });
  }
};

export const deleteBoarding: RequestHandler = (req, res) => {
  try {
    const deleted = boardingsService.deleteBoarding(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Boarding nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Boardings.', details: error.message });
  }
};
