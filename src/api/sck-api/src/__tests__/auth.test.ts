import { jest } from '@jest/globals';
import { createHash, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const mockedSendMail = jest.fn<(to: string, subject: string, html: string) => Promise<void>>();
mockedSendMail.mockResolvedValue(undefined);

jest.unstable_mockModule('../services/mailer-service.js', () => ({
  sendMail: mockedSendMail,
}));

const { db } = await import('../db/connection.js');
const { default: authRoutes } = await import('../routes/auth-route.js');
const { default: invitesRoutes } = await import('../routes/invites-route.js');

const app = express();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', invitesRoutes);

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
});
