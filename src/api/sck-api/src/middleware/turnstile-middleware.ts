/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { verifyTurnstileToken } from '../services/turnstile-service.js';

dotenv.config();

// Fail-open until a real Cloudflare Turnstile widget exists: there is no
// TURNSTILE_SECRET_KEY configured anywhere yet (no Cloudflare account has
// been created), and the frontend doesn't send a token yet either (that's a
// later round) - enforcing this now would reject every public submission,
// including admin login, in production. Once both the secret key here and
// the site key in the frontend are set, this starts enforcing automatically
// with no further code change.
const isConfigured = !!process.env.TURNSTILE_SECRET_KEY;
let warnedOnce = false;

// Sits after publicWriteLimiter (cheaper to reject an already-rate-limited
// request before spending an external API call on it) and before the
// controller on every public write endpoint. The client-side widget stops
// non-browser bots from even reaching this; this stops a raw HTTP client
// (curl, a script) from skipping the widget and posting directly.
export const requireTurnstile: RequestHandler = async (req, res, next) => {
  if (!isConfigured) {
    if (!warnedOnce) {
      console.warn('TURNSTILE_SECRET_KEY nicht gesetzt - Captcha-Prüfung ist deaktiviert.');
      warnedOnce = true;
    }
    next();
    return;
  }

  const token = req.body?.turnstileToken;
  if (typeof token !== 'string' || !token) {
    res.status(400).json({ error: 'Bitte bestätige das Sicherheits-Captcha.' });
    return;
  }

  const verified = await verifyTurnstileToken(token, req.ip);
  if (!verified) {
    res.status(400).json({ error: 'Captcha-Prüfung fehlgeschlagen. Bitte erneut versuchen.' });
    return;
  }

  // Only ever needed for this check - strip it so it never leaks into
  // whatever the controller persists (registrations.ndjson, trip_registrations, ...).
  delete req.body.turnstileToken;
  next();
};
