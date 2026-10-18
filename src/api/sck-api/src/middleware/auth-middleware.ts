/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { AuthUser, Permission } from '../domain/auth.js';
import { verifySessionToken } from '../services/auth-service.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

// Reads apart Bearer <token>, no cookies/CORS-credentials involved since the
// admin app is a separate SPA calling the API cross-origin with a bearer
// token it holds in memory/localStorage.
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ error: 'Anmeldung erforderlich.' });
    return;
  }

  const user = verifySessionToken(token);
  if (!user) {
    res.status(401).json({ error: 'Sitzung ungültig oder abgelaufen.' });
    return;
  }

  req.user = user;
  next();
};

// Neu eingeladene Nutzer starten rein lesend: reads stay unauthenticated
// (the public site consumes them too), only mutating routes are gated by a
// granular permission on top of requireAuth. Super-admin bypasses all checks
// to avoid a chicken-and-egg bootstrap problem for granting the very first
// 'users:manage' permission.
export const requirePermission = (permission: Permission): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Anmeldung erforderlich.' });
      return;
    }
    if (req.user.isSuperAdmin || req.user.permissions.includes(permission)) {
      next();
      return;
    }
    res.status(403).json({ error: 'Fehlende Berechtigung.' });
  };
};
