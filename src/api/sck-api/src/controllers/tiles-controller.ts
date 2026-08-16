/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { TileActions, TileBehavior, TileCreationParams, TileStatus, TileType } from '../domain/tile.js';
import * as tilesService from '../services/tiles-service.js';

const isValidTilePayload = (body: Partial<TileCreationParams>): string | undefined => {
  if (!body.title) return 'Titel ist erforderlich.';
  if (!body.type || !Object.values(TileType).includes(body.type)) return 'Ungültiger Tile-Typ.';
  if (!body.status || !Object.values(TileStatus).includes(body.status)) return 'Ungültiger Status.';
  if (!body.behavior || !Object.values(TileBehavior).includes(body.behavior)) return 'Ungültiges Verhalten.';
  if (body.actions && !body.actions.every((a) => Object.values(TileActions).includes(a))) {
    return 'Ungültige Aktion.';
  }
  return undefined;
};

export const listTiles: RequestHandler = (req, res) => {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
    const limit = parseInt(String(req.query.limit ?? '100'), 10) || 100;

    const result = tilesService.listTiles({
      page,
      limit,
      sort: req.query.sort ? String(req.query.sort) : undefined,
      direction: req.query.direction === 'desc' ? 'desc' : 'asc',
      search: req.query.search ? String(req.query.search) : undefined,
      type: req.query.type ? String(req.query.type) : undefined,
      status: req.query.status ? String(req.query.status) : undefined,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Fehler beim Laden der Tiles:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Tiles.', details: error.message });
  }
};

export const getTile: RequestHandler = (req, res) => {
  try {
    const tile = tilesService.getTile(String(req.params.id));
    if (!tile) {
      res.status(404).json({ error: 'Tile nicht gefunden.' });
      return;
    }
    res.status(200).json(tile);
  } catch (error: any) {
    console.error('Fehler beim Laden des Tiles:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Tiles.', details: error.message });
  }
};

export const createTile: RequestHandler = (req, res) => {
  try {
    const body = req.body as TileCreationParams;
    const validationError = isValidTilePayload(body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const tile = tilesService.createTile(body);
    res.status(201).json(tile);
  } catch (error: any) {
    console.error('Fehler beim Erstellen des Tiles:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Tiles.', details: error.message });
  }
};

export const updateTile: RequestHandler = (req, res) => {
  try {
    const body = req.body as TileCreationParams;
    const validationError = isValidTilePayload(body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const tile = tilesService.updateTile(String(req.params.id), body);
    if (!tile) {
      res.status(404).json({ error: 'Tile nicht gefunden.' });
      return;
    }
    res.status(200).json(tile);
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren des Tiles:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Tiles.', details: error.message });
  }
};

export const deleteTile: RequestHandler = (req, res) => {
  try {
    const deleted = tilesService.deleteTile(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Tile nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des Tiles:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Tiles.', details: error.message });
  }
};

// Dedicated Trip-Boarding assignment route (brief calls for this in addition
// to boardings being writable as part of the plain tile payload above).
export const updateTileBoardings: RequestHandler = (req, res) => {
  try {
    const boardings = req.body?.boardings;
    if (!Array.isArray(boardings) || !boardings.every((b) => typeof b === 'string')) {
      res.status(400).json({ error: 'boardings muss ein Array von Namen sein.' });
      return;
    }

    const id = String(req.params.id);
    const existing = tilesService.getTile(id);
    if (!existing) {
      res.status(404).json({ error: 'Tile nicht gefunden.' });
      return;
    }

    tilesService.setTileBoardings(id, boardings);
    res.status(200).json(tilesService.getTile(id));
  } catch (error: any) {
    console.error('Fehler beim Zuordnen der Boardings:', error);
    res.status(500).json({ error: 'Fehler beim Zuordnen der Boardings.', details: error.message });
  }
};
