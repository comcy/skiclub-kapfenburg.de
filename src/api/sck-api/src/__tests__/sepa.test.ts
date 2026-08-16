import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: sepaRoutes } = await import('../routes/sepa-route.js');

const app = express();
app.use(express.json());
app.use('/api', sepaRoutes);

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
  db.exec('DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

describe('SEPA data route', () => {
  it('GET /api/sepa-data - ohne Anmeldung 401', async () => {
    const res = await request(app).get('/api/sepa-data');
    expect(res.status).toBe(401);
  });

  it('GET /api/sepa-data - angemeldet aber ohne sepa:read Recht 403', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app).get('/api/sepa-data').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('GET /api/sepa-data - mit sepa:read Recht 200 (leere Tabelle)', async () => {
    const token = createAuthedUser(['sepa:read']);
    const res = await request(app).get('/api/sepa-data').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
