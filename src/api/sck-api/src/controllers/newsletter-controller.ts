/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import * as newsletterService from '../services/newsletter-service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createNewsletterSignup: RequestHandler = (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim();
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Eine gültige E-Mail-Adresse ist erforderlich.' });
      return;
    }

    newsletterService.createSignup(email);
    // Idempotent and no hint whether the address was already subscribed -
    // avoids turning this into an email-enumeration endpoint.
    res.status(201).json({ message: 'Danke für die Anmeldung!' });
  } catch (error: any) {
    console.error('Fehler bei der Newsletter-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung.' });
  }
};

export const listNewsletterSignups: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(newsletterService.listSignups());
  } catch (error: any) {
    console.error('Fehler beim Laden der Newsletter-Anmeldungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Newsletter-Anmeldungen.', details: error.message });
  }
};

export const deleteNewsletterSignup: RequestHandler = (req, res) => {
  try {
    const deleted = newsletterService.deleteSignup(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Anmeldung nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen der Newsletter-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Newsletter-Anmeldung.', details: error.message });
  }
};
