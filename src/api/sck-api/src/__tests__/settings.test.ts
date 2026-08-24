import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: settingsRoutes } = await import('../routes/settings-route.js');

const app = express();
app.use(express.json());
app.use('/api', settingsRoutes);

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const createAuthedUser = (permissions: string[] = []): string => {
  const userId = randomUUID();
  db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(userId, `${userId}@test.com`);
  const token = randomBytes(16).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashToken(token),
    userId,
    new Date(Date.now() + 100000).toISOString(),
  );
  for (const permission of permissions) {
    db.prepare('INSERT INTO permissions (user_id, permission) VALUES (?, ?)').run(userId, permission);
  }
  return token;
};

beforeEach(() => {
  db.exec('DELETE FROM settings; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

describe('Settings Routes', () => {
  it('GET /api/settings/notification-bcc - ist öffentlich, leer wenn nichts gesetzt', async () => {
    const res = await request(app).get('/api/settings/notification-bcc');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ customBccList: [] });
  });

  it('PUT /api/settings/notification-bcc - erfordert Anmeldung', async () => {
    const res = await request(app).put('/api/settings/notification-bcc').send({ customBccList: ['a@test.com'] });
    expect(res.status).toBe(401);
  });

  it('PUT /api/settings/notification-bcc - erfordert tiles:write', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .put('/api/settings/notification-bcc')
      .set('Authorization', `Bearer ${token}`)
      .send({ customBccList: ['a@test.com'] });
    expect(res.status).toBe(403);
  });

  it('speichert und liest die globale BCC-Liste mit tiles:write', async () => {
    const token = createAuthedUser(['tiles:write']);

    const putRes = await request(app)
      .put('/api/settings/notification-bcc')
      .set('Authorization', `Bearer ${token}`)
      .send({ customBccList: ['board@example.com', 'office@example.com'] });
    expect(putRes.status).toBe(200);

    const getRes = await request(app).get('/api/settings/notification-bcc');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({ customBccList: ['board@example.com', 'office@example.com'] });
  });

  it('lehnt eine ungültige customBccList mit 400 ab', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .put('/api/settings/notification-bcc')
      .set('Authorization', `Bearer ${token}`)
      .send({ customBccList: 'not-an-array' });
    expect(res.status).toBe(400);
  });
});
