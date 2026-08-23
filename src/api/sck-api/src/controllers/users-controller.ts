/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { isPermission, Permission, UpdatePermissionsBody } from '../domain/auth.js';
import * as authService from '../services/auth-service.js';
import { setPermissionsForUser } from '../services/permissions-service.js';

export const listUsers: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(authService.listUsers());
  } catch (error: any) {
    console.error('Fehler beim Laden der Nutzer:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Nutzer.', details: error.message });
  }
};

export const listUserDirectory: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(authService.listUserDirectory());
  } catch (error: any) {
    console.error('Fehler beim Laden des Nutzerverzeichnisses:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Nutzerverzeichnisses.', details: error.message });
  }
};

export const updateUserPermissions: RequestHandler = (req, res) => {
  try {
    const { permissions } = req.body as UpdatePermissionsBody;
    if (!Array.isArray(permissions) || !permissions.every(isPermission)) {
      res.status(400).json({ error: 'Ungültige Berechtigungen.' });
      return;
    }

    const id = String(req.params.id);
    const user = authService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'Nutzer nicht gefunden.' });
      return;
    }

    setPermissionsForUser(id, permissions as Permission[], req.user!.email);
    res.status(200).json(authService.getUserById(id));
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren der Berechtigungen:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Berechtigungen.', details: error.message });
  }
};
