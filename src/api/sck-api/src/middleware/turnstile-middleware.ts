/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { verifyTurnstileToken } from '../services/turnstile-service.js';

// Sits after publicWriteLimiter (cheaper to reject an already-rate-limited
// request before spending an external API call on it) and before the
// controller on every public write endpoint. The client-side widget stops
// non-browser bots from even reaching this; this stops a raw HTTP client
// (curl, a script) from skipping the widget and posting directly.
export const requireTurnstile: RequestHandler = async (req, res, next) => {
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
