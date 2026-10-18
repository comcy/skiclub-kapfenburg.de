/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { GoogleExchangeBody, MagicLinkRequestBody, MagicLinkVerifyBody } from '../domain/auth.js';
import * as authService from '../services/auth-service.js';
import { sendMail } from '../services/mailer.js';

dotenv.config();

const ADMIN_APP_URL = process.env.ADMIN_APP_URL || 'http://localhost:4200';

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const requestMagicLink: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body as MagicLinkRequestBody;
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
      return;
    }

    const token = authService.requestMagicLink(email);
    // Always respond the same way regardless of invite status, so the
    // endpoint can't be used to enumerate which addresses are invited.
    if (token) {
      const link = `${ADMIN_APP_URL}/auth/callback?token=${token}`;
      await sendMail(
        email,
        'Anmeldelink für das SCK-Admin-Tool',
        `<p>Klicke auf den folgenden Link, um dich anzumelden (gültig 15 Minuten):</p><p><a href="${link}">${link}</a></p>`,
      );
    }

    res.status(200).json({ message: 'Falls diese Adresse eingeladen wurde, wurde ein Anmeldelink verschickt.' });
  } catch (error: any) {
    console.error('Fehler beim Versenden des Anmeldelinks:', error);
    res.status(500).json({ error: 'Fehler beim Versenden des Anmeldelinks.' });
  }
};

export const verifyMagicLink: RequestHandler = (req, res) => {
  try {
    const { token } = req.body as MagicLinkVerifyBody;
    if (!token) {
      res.status(400).json({ error: 'Token ist erforderlich.' });
      return;
    }

    const result = authService.verifyMagicLink(token);
    if (!result) {
      res.status(401).json({ error: 'Anmeldelink ungültig oder abgelaufen.' });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Fehler beim Verifizieren des Anmeldelinks:', error);
    res.status(500).json({ error: 'Fehler beim Verifizieren des Anmeldelinks.' });
  }
};

export const googleStart: RequestHandler = (req, res) => {
  try {
    const state = authService.createOAuthState();
    res.redirect(authService.buildGoogleAuthUrl(state));
  } catch (error: any) {
    console.error('Fehler beim Starten der Google-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Starten der Google-Anmeldung.' });
  }
};

export const googleCallback: RequestHandler = async (req, res) => {
  try {
    const state = req.query.state ? String(req.query.state) : undefined;
    if (!authService.consumeOAuthState(state)) {
      // Missing/unknown/already-used/expired state - reject before even
      // touching the Google code, this is the login-CSRF guard.
      res.redirect(`${ADMIN_APP_URL}/auth/callback?error=invalid_state`);
      return;
    }

    const code = req.query.code ? String(req.query.code) : undefined;
    if (!code) {
      res.redirect(`${ADMIN_APP_URL}/auth/callback?error=missing_code`);
      return;
    }

    const email = await authService.verifyGoogleAuthCode(code);
    if (!email) {
      res.redirect(`${ADMIN_APP_URL}/auth/callback?error=google_verification_failed`);
      return;
    }

    const result = authService.completeGoogleLogin(email);
    if (!result) {
      // Valid Google account, but not on the invite allowlist — this is the
      // check the brief explicitly calls out as non-negotiable.
      res.redirect(`${ADMIN_APP_URL}/auth/callback?error=not_invited`);
      return;
    }

    // Never put the real, live session token in a redirect URL (browser
    // history, server/proxy logs) - hand back a short-lived, single-use
    // exchange code instead; the frontend swaps it for the real token via
    // POST /auth/google/exchange, same shape as the magic-link flow.
    const exchangeCode = authService.createLoginExchangeCode(result.sessionToken);
    res.redirect(`${ADMIN_APP_URL}/auth/callback?code=${exchangeCode}`);
  } catch (error: any) {
    console.error('Fehler bei der Google-Anmeldung:', error);
    res.redirect(`${ADMIN_APP_URL}/auth/callback?error=server_error`);
  }
};

export const exchangeGoogleLoginCode: RequestHandler = (req, res) => {
  try {
    const { code } = req.body as GoogleExchangeBody;
    if (!code) {
      res.status(400).json({ error: 'Code ist erforderlich.' });
      return;
    }

    const sessionToken = authService.consumeLoginExchangeCode(code);
    if (!sessionToken) {
      res.status(401).json({ error: 'Code ungültig oder abgelaufen.' });
      return;
    }

    res.status(200).json({ sessionToken });
  } catch (error: any) {
    console.error('Fehler beim Einlösen des Anmelde-Codes:', error);
    res.status(500).json({ error: 'Fehler beim Einlösen des Anmelde-Codes.' });
  }
};

export const getCurrentUser: RequestHandler = (req, res) => {
  res.status(200).json(req.user);
};
