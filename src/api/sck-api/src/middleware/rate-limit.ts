/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { MINUTE, rateLimit } from 'express-rate-limit';

// Applied per-route (not globally in index.ts), since some routers mix
// public and authenticated endpoints (e.g. trip-registrations-route.ts) -
// a global limiter would needlessly throttle authenticated admin-app
// traffic too.

// Generous: covers normal browsing of the public site, where a single page
// load can trigger several GET calls (tiles, boardings, settings). A tight
// limit here would risk locking out legitimate visitors behind a shared IP
// (school/office NAT).
export const publicReadLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
});

// Strict: for routes that write data or send mail (registration, magic-link
// requests, contact mail) - legitimate single-user flows stay well under
// this, automated abuse doesn't.
export const publicWriteLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
});
