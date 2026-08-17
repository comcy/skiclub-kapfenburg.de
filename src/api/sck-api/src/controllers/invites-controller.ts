/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { AcceptInviteBody, CreateInviteBody } from '../domain/auth.js';
import * as authService from '../services/auth-service.js';
import { sendMail } from '../services/mailer-service.js';

dotenv.config();

const ADMIN_APP_URL = process.env.ADMIN_APP_URL || 'http://localhost:4200';

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const createInvite: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body as CreateInviteBody;
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
      return;
    }

    const { token } = authService.createInvite(email, req.user!.email);
    const link = `${ADMIN_APP_URL}/invite/${token}`;
    await sendMail(
      email,
      'Einladung zum SCK-Admin-Tool',
      `<p>Du wurdest zur Verwaltung der Vereins-Website eingeladen. Klicke auf den folgenden Link, um die Einladung anzunehmen (gültig 7 Tage):</p><p><a href="${link}">${link}</a></p>`,
    );

    res.status(201).json({ message: 'Einladung wurde verschickt.', email });
  } catch (error: any) {
    console.error('Fehler beim Erstellen der Einladung:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Einladung.', details: error.message });
  }
};

// Public preview for the invite-accept screen: lets an as-yet-unauthenticated
// invitee see which address they were invited as before choosing a login
// method. Deliberately returns only the email, nothing else about the invite.
export const getInvitePreview: RequestHandler = (req, res) => {
  try {
    const invite = authService.getInviteByToken(String(req.params.token));
    if (!invite) {
      res.status(404).json({ error: 'Einladung ungültig, bereits angenommen oder abgelaufen.' });
      return;
    }
    res.status(200).json({ email: invite.email });
  } catch (error: any) {
    console.error('Fehler beim Laden der Einladung:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Einladung.', details: error.message });
  }
};

export const listInvites: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(authService.listInvites());
  } catch (error: any) {
    console.error('Fehler beim Laden der Einladungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Einladungen.', details: error.message });
  }
};

export const acceptInvite: RequestHandler = (req, res) => {
  try {
    const { token } = req.body as AcceptInviteBody;
    if (!token) {
      res.status(400).json({ error: 'Token ist erforderlich.' });
      return;
    }

    const result = authService.acceptInvite(token);
    if (!result) {
      res.status(401).json({ error: 'Einladung ungültig, bereits angenommen oder abgelaufen.' });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Fehler beim Annehmen der Einladung:', error);
    res.status(500).json({ error: 'Fehler beim Annehmen der Einladung.', details: error.message });
  }
};
