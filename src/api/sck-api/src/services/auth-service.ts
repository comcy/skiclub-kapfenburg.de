/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../db/connection.js';
import { AuthUser } from '../domain/auth.js';
import { getPermissionsForUser } from './permissions-service.js';

dotenv.config();

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minutes
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const OAUTH_STATE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const LOGIN_EXCHANGE_TTL_MS = 60 * 1000; // 1 minute

// Short-lived, single-use, in-memory (single server instance, see the
// Dockerfile/CMD - no horizontal scaling to worry about) values for the two
// round-trips that must never become a live credential or CSRF nonce
// sitting in a URL/browser-history/log: the OAuth "state" nonce, and the
// post-OAuth session exchange code. A DB table would be overkill for
// values that live seconds to minutes and don't need to survive a restart.
const oauthStates = new Map<string, number>(); // state -> expiresAt
const loginExchangeCodes = new Map<string, { sessionToken: string; expiresAt: number }>();

export const createOAuthState = (): string => {
  const state = generateToken();
  oauthStates.set(state, Date.now() + OAUTH_STATE_TTL_MS);
  return state;
};

// Single-use: deletes the entry on first read regardless of outcome, so a
// captured/replayed state can never be consumed twice.
export const consumeOAuthState = (state: string | undefined): boolean => {
  if (!state) return false;
  const expiresAt = oauthStates.get(state);
  oauthStates.delete(state);
  return !!expiresAt && expiresAt > Date.now();
};

export const createLoginExchangeCode = (sessionToken: string): string => {
  const code = generateToken();
  loginExchangeCodes.set(code, { sessionToken, expiresAt: Date.now() + LOGIN_EXCHANGE_TTL_MS });
  return code;
};

export const consumeLoginExchangeCode = (code: string): string | undefined => {
  const entry = loginExchangeCodes.get(code);
  loginExchangeCodes.delete(code);
  if (!entry || entry.expiresAt < Date.now()) return undefined;
  return entry.sessionToken;
};

const nowIso = (): string => new Date().toISOString();
const addMs = (ms: number): string => new Date(Date.now() + ms).toISOString();

const generateToken = (): string => randomBytes(32).toString('hex');
const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

interface UserRow {
  id: string;
  email: string;
  newsSince?: string | null;
}

const findUserByEmail = (email: string): UserRow | undefined =>
  db.prepare('SELECT id, email FROM users WHERE email = ?').get(email) as UserRow | undefined;

const createUser = (email: string): UserRow => {
  const id = randomUUID();
  db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(id, email);
  return { id, email };
};

interface InviteRow {
  id: string;
  email: string;
}

const findActiveInviteByEmail = (email: string): InviteRow | undefined =>
  db
    .prepare(
      `SELECT id, email FROM invites
       WHERE email = ? AND accepted_at IS NULL AND expires_at > ?
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(email, nowIso()) as InviteRow | undefined;

// Allowlist check: an email may sign in if it already has a user record, or
// has a still-open invite waiting for its first login. A gap the brief left
// open: whether "accepting" an invite is a separate UI step or happens
// implicitly on first login. Chosen here: first successful login (magic-link
// or Google) against an invited-but-not-yet-accepted email accepts the
// invite and creates the user in the same step — simplest flow, no second
// round-trip required, and /api/invites/:token/accept still exists for a
// dedicated "accept" screen if the frontend wants one.
const ensureUserForAllowedEmail = (email: string): UserRow | undefined => {
  const existing = findUserByEmail(email);
  if (existing) return existing;

  const invite = findActiveInviteByEmail(email);
  if (!invite) return undefined;

  const user = createUser(email);
  db.prepare('UPDATE invites SET accepted_at = ? WHERE id = ?').run(nowIso(), invite.id);
  return user;
};

const createSession = (userId: string): string => {
  const token = generateToken();
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashToken(token),
    userId,
    addMs(SESSION_TTL_MS),
  );
  // news_since = vorheriger Login (beim allerersten Login: jetzt) - "neu seit dem letzten Login". Beide
  // Zuweisungen lesen den Zustand VOR dem UPDATE.
  const now = nowIso();
  db.prepare('UPDATE users SET news_since = COALESCE(last_login_at, ?), last_login_at = ? WHERE id = ?').run(
    now,
    now,
    userId,
  );
  return token;
};

const toAuthUser = (user: UserRow): AuthUser => ({
  id: user.id,
  email: user.email,
  isSuperAdmin: !!SUPER_ADMIN_EMAIL && user.email.toLowerCase() === SUPER_ADMIN_EMAIL,
  permissions: getPermissionsForUser(user.id),
  newsSince: user.newsSince ?? null,
});

// Login-Ergebnis: Session anlegen (setzt news_since) und den Nutzer DANACH frisch lesen, damit
// die Antwort schon den neuen newsSince enthaelt.
const startSession = (user: UserRow): { user: AuthUser; sessionToken: string } => {
  const sessionToken = createSession(user.id);
  const fresh = db.prepare('SELECT id, email, news_since AS newsSince FROM users WHERE id = ?').get(user.id) as unknown as UserRow;
  return { user: toAuthUser(fresh), sessionToken };
};

export const verifySessionToken = (token: string): AuthUser | undefined => {
  const row = db
    .prepare(
      `SELECT u.id AS id, u.email AS email, u.news_since AS newsSince FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(hashToken(token), nowIso()) as UserRow | undefined;
  return row ? toAuthUser(row) : undefined;
};

// Returns the raw token to email to the user, or undefined if the address
// isn't allowed to sign in (caller should still respond generically to
// avoid leaking which emails are invited).
export const requestMagicLink = (email: string): string | undefined => {
  const normalized = email.toLowerCase().trim();
  const isSuperAdmin = !!SUPER_ADMIN_EMAIL && normalized === SUPER_ADMIN_EMAIL;
  if (!isSuperAdmin && !findUserByEmail(normalized) && !findActiveInviteByEmail(normalized)) {
    return undefined;
  }

  const token = generateToken();
  db.prepare('INSERT INTO magic_link_tokens (token_hash, email, expires_at) VALUES (?, ?, ?)').run(
    hashToken(token),
    normalized,
    addMs(MAGIC_LINK_TTL_MS),
  );
  return token;
};

export const verifyMagicLink = (token: string): { user: AuthUser; sessionToken: string } | undefined => {
  const hashed = hashToken(token);
  const row = db
    .prepare('SELECT email FROM magic_link_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?')
    .get(hashed, nowIso()) as { email: string } | undefined;
  if (!row) return undefined;

  db.prepare('UPDATE magic_link_tokens SET used_at = ? WHERE token_hash = ?').run(nowIso(), hashed);

  const isSuperAdmin = !!SUPER_ADMIN_EMAIL && row.email === SUPER_ADMIN_EMAIL;
  const user = isSuperAdmin ? (findUserByEmail(row.email) ?? createUser(row.email)) : ensureUserForAllowedEmail(row.email);
  if (!user) return undefined;

  return startSession(user);
};

export const createInvite = (email: string, invitedBy: string): { token: string } => {
  const normalized = email.toLowerCase().trim();
  const id = randomUUID();
  const token = generateToken();
  db.prepare('INSERT INTO invites (id, email, token_hash, invited_by, expires_at) VALUES (?, ?, ?, ?, ?)').run(
    id,
    normalized,
    hashToken(token),
    invitedBy,
    addMs(INVITE_TTL_MS),
  );
  return { token };
};

export const listInvites = (): { id: string; email: string; createdAt: string; expiresAt: string; acceptedAt: string | null }[] =>
  db.prepare('SELECT id, email, created_at AS createdAt, expires_at AS expiresAt, accepted_at AS acceptedAt FROM invites ORDER BY created_at DESC').all() as {
    id: string;
    email: string;
    createdAt: string;
    expiresAt: string;
    acceptedAt: string | null;
  }[];

export const getInviteByToken = (token: string): { email: string } | undefined => {
  const invite = db
    .prepare('SELECT email FROM invites WHERE token_hash = ? AND accepted_at IS NULL AND expires_at > ?')
    .get(hashToken(token), nowIso()) as { email: string } | undefined;
  return invite;
};

export const acceptInvite = (token: string): { user: AuthUser; sessionToken: string } | undefined => {
  const hashed = hashToken(token);
  const invite = db
    .prepare('SELECT id, email FROM invites WHERE token_hash = ? AND accepted_at IS NULL AND expires_at > ?')
    .get(hashed, nowIso()) as InviteRow | undefined;
  if (!invite) return undefined;

  db.prepare('UPDATE invites SET accepted_at = ? WHERE id = ?').run(nowIso(), invite.id);
  const user = findUserByEmail(invite.email) ?? createUser(invite.email);
  return startSession(user);
};

export const listUsers = (): (AuthUser & { lastLoginAt: string | null })[] => {
  const rows = db.prepare('SELECT id, email, last_login_at AS lastLoginAt FROM users ORDER BY email').all() as unknown as (UserRow & {
    lastLoginAt: string | null;
  })[];
  return rows.map((row) => ({ ...toAuthUser(row), lastLoginAt: row.lastLoginAt }));
};

// Minimal id+email list for pickers (e.g. assigning a tile's organizer) —
// deliberately lighter than listUsers() so it can sit behind plain
// requireAuth instead of users:manage: no permissions or lastLoginAt, just
// enough to let any admin see who else has an account.
export const listUserDirectory = (): { id: string; email: string }[] =>
  db.prepare('SELECT id, email FROM users ORDER BY email').all() as { id: string; email: string }[];

const googleClient = (): OAuth2Client => new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

export const buildGoogleAuthUrl = (state: string): string =>
  googleClient().generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });

// Exchanges an OAuth authorization code for a verified Google account email.
// Verification happens locally against Google's published keys via
// verifyIdToken — never trust the code exchange response alone.
export const verifyGoogleAuthCode = async (code: string): Promise<string | undefined> => {
  const client = googleClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) return undefined;

  const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) return undefined;

  return payload.email.toLowerCase();
};

// Logs an already-verified Google email in, applying the same invite
// allowlist as magic-link — a valid Google account is not enough on its own.
export const completeGoogleLogin = (email: string): { user: AuthUser; sessionToken: string } | undefined => {
  const isSuperAdmin = !!SUPER_ADMIN_EMAIL && email === SUPER_ADMIN_EMAIL;
  const user = isSuperAdmin ? (findUserByEmail(email) ?? createUser(email)) : ensureUserForAllowedEmail(email);
  if (!user) return undefined;

  return startSession(user);
};

export const getUserById = (id: string): AuthUser | undefined => {
  const row = db.prepare('SELECT id, email FROM users WHERE id = ?').get(id) as UserRow | undefined;
  return row ? toAuthUser(row) : undefined;
};

// "Alles gesehen": ab jetzt gilt nur noch Neues als neu.
export const markNewsSeen = (userId: string): string => {
  const now = nowIso();
  db.prepare('UPDATE users SET news_since = ? WHERE id = ?').run(now, userId);
  return now;
};
