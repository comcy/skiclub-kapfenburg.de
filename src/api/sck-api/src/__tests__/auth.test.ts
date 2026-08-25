import { jest } from '@jest/globals';
import { createHash, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const mockedSendMail = jest.fn<(to: string, subject: string, html: string) => Promise<void>>();
mockedSendMail.mockResolvedValue(undefined);

jest.unstable_mockModule('../services/mailer.js', () => ({
  sendMail: mockedSendMail,
}));

const { db } = await import('../db/connection.js');
const authService = await import('../services/auth-service.js');
const { default: authRoutes } = await import('../routes/auth-route.js');
const { default: invitesRoutes } = await import('../routes/invites-route.js');

const app = express();
app.use(express.json());
// requireTurnstile now gates POST /auth/magic-link (see routes/auth-route.ts) -
// auto-fill a token here rather than touching every request in this file;
// the middleware's own behavior is covered by turnstile.test.ts.
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') (req.body as Record<string, unknown>).turnstileToken = 'test-token';
  next();
});
app.use('/api', authRoutes);
app.use('/api', invitesRoutes);

// Jest's node test environment doesn't expose native `fetch` as an own
// property, so jest.spyOn(globalThis, 'fetch') fails - assign directly.
const mockFetch = jest.fn();
(globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;
beforeEach(() => {
  mockFetch.mockReset().mockResolvedValue({
    json: () => Promise.resolve({ success: true }),
  });
});

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const extractTokenFromLink = (): string => {
  const html = mockedSendMail.mock.calls.at(-1)?.[2] as string;
  const match = html.match(/token=([a-f0-9]+)/);
  if (!match) throw new Error('Kein Token im gemockten Mail-Versand gefunden.');
  return match[1];
};

beforeEach(() => {
  mockedSendMail.mockClear();
  db.exec(
    'DELETE FROM sessions; DELETE FROM magic_link_tokens; DELETE FROM permissions; DELETE FROM invites; DELETE FROM users;',
  );
});

describe('Auth Routes', () => {
  it('POST /api/auth/magic-link - antwortet generisch, verschickt aber keine Mail für nicht eingeladene Adressen', async () => {
    const res = await request(app).post('/api/auth/magic-link').send({ email: 'unbekannt@example.com' });
    expect(res.status).toBe(200);
    expect(mockedSendMail).not.toHaveBeenCalled();
  });

  it('Magic-Link: eingeladene Adresse kann sich anmelden, Einladung wird dabei angenommen', async () => {
    const inviteId = randomUUID();
    db.prepare(
      "INSERT INTO invites (id, email, token_hash, expires_at) VALUES (?, ?, 'unused', datetime('now', '+7 days'))",
    ).run(inviteId, 'invited@example.com');

    const requestRes = await request(app).post('/api/auth/magic-link').send({ email: 'invited@example.com' });
    expect(requestRes.status).toBe(200);
    expect(mockedSendMail).toHaveBeenCalledTimes(1);

    const token = extractTokenFromLink();
    const verifyRes = await request(app).post('/api/auth/magic-link/verify').send({ token });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.user.email).toBe('invited@example.com');
    expect(verifyRes.body.sessionToken).toBeDefined();

    const invite = db.prepare('SELECT accepted_at FROM invites WHERE id = ?').get(inviteId) as { accepted_at: string | null };
    expect(invite.accepted_at).not.toBeNull();

    // token is single-use
    const secondVerify = await request(app).post('/api/auth/magic-link/verify').send({ token });
    expect(secondVerify.status).toBe(401);
  });

  it('GET /api/auth/me - erfordert eine gültige Sitzung', async () => {
    const unauthedRes = await request(app).get('/api/auth/me');
    expect(unauthedRes.status).toBe(401);

    const userId = randomUUID();
    db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(userId, 'me@example.com');
    const token = 'a'.repeat(64);
    db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', '+1 day'))").run(
      hashToken(token),
      userId,
    );

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@example.com');
    expect(res.body.permissions).toEqual([]);
  });

  it('Invite-Annahme: gültiges Token legt einen Nutzer an, ein zweiter Versuch schlägt fehl', async () => {
    const createInviteRes = await request(app)
      .post('/api/invites')
      .send({ email: 'wont-happen@example.com' }); // no auth -> 401, users:manage required
    expect(createInviteRes.status).toBe(401);

    // Seed an invite directly to exercise the accept endpoint in isolation.
    const inviteId = randomUUID();
    db.prepare(
      "INSERT INTO invites (id, email, token_hash, expires_at) VALUES (?, ?, ?, datetime('now', '+7 days'))",
    ).run(inviteId, 'accepted@example.com', hashToken('raw-invite-token'));

    const acceptRes = await request(app).post('/api/invites/accept').send({ token: 'raw-invite-token' });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.user.email).toBe('accepted@example.com');

    const secondAccept = await request(app).post('/api/invites/accept').send({ token: 'raw-invite-token' });
    expect(secondAccept.status).toBe(401);
  });

  it('GET /api/auth/google/callback - lehnt einen fehlenden/unbekannten state ab, bevor der Google-Code eingelöst wird (CSRF-Schutz)', async () => {
    const res = await request(app).get('/api/auth/google/callback').query({ code: 'irrelevant-because-state-first' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('error=invalid_state');
  });

  it('POST /api/auth/google/exchange - tauscht einen gültigen, einmal verwendbaren Code gegen das Session-Token', async () => {
    const code = authService.createLoginExchangeCode('the-real-session-token');

    const res = await request(app).post('/api/auth/google/exchange').send({ code });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ sessionToken: 'the-real-session-token' });

    // single-use: a second exchange with the same code fails
    const secondRes = await request(app).post('/api/auth/google/exchange').send({ code });
    expect(secondRes.status).toBe(401);
  });

  it('POST /api/auth/google/exchange - lehnt einen unbekannten Code mit 401 ab', async () => {
    const res = await request(app).post('/api/auth/google/exchange').send({ code: 'never-issued' });
    expect(res.status).toBe(401);
  });

  it('consumeOAuthState/consumeLoginExchangeCode sind einmal verwendbar', () => {
    const state = authService.createOAuthState();
    expect(authService.consumeOAuthState(state)).toBe(true);
    expect(authService.consumeOAuthState(state)).toBe(false);

    const code = authService.createLoginExchangeCode('token-x');
    expect(authService.consumeLoginExchangeCode(code)).toBe('token-x');
    expect(authService.consumeLoginExchangeCode(code)).toBeUndefined();
  });

  it('GET /api/invites/:token - zeigt die eingeladene Adresse für einen offenen Einladungslink, sonst 404', async () => {
    db.prepare(
      "INSERT INTO invites (id, email, token_hash, expires_at) VALUES (?, ?, ?, datetime('now', '+7 days'))",
    ).run(randomUUID(), 'preview@example.com', hashToken('preview-token'));

    const res = await request(app).get('/api/invites/preview-token');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('preview@example.com');

    const missingRes = await request(app).get('/api/invites/does-not-exist');
    expect(missingRes.status).toBe(404);
  });
});
