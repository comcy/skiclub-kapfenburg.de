/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { NOTIFICATION_BCC_SETTING_KEY, NotificationBccSetting } from '../domain/settings.js';
import { getSetting, setSetting } from '../services/settings-service.js';

const EMPTY_BCC_SETTING: NotificationBccSetting = { customBccList: [] };

export const getNotificationBccSetting: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(getSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY) ?? EMPTY_BCC_SETTING);
  } catch (error: any) {
    console.error('Fehler beim Laden der Benachrichtigungs-Einstellungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Benachrichtigungs-Einstellungen.', details: error.message });
  }
};

export const updateNotificationBccSetting: RequestHandler = (req, res) => {
  try {
    const body = req.body as NotificationBccSetting;
    if (!Array.isArray(body.customBccList) || !body.customBccList.every((email) => typeof email === 'string')) {
      res.status(400).json({ error: 'customBccList muss ein Array von Strings sein.' });
      return;
    }
    setSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY, { customBccList: body.customBccList });
    res.status(200).json({ customBccList: body.customBccList });
  } catch (error: any) {
    console.error('Fehler beim Speichern der Benachrichtigungs-Einstellungen:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Benachrichtigungs-Einstellungen.', details: error.message });
  }
};
