import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';
import newsletterRoutes from '../routes/newsletter-route.js';

const app = express();
app.use(express.json());
app.use('/api', newsletterRoutes);

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
  db.exec('DELETE FROM newsletter_signups; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

describe('Newsletter Routes', () => {
  it('POST /api/newsletter/signup - ist öffentlich und legt eine Anmeldung an', async () => {
    const res = await request(app).post('/api/newsletter/signup').send({ email: 'lea@test.com' });
    expect(res.status).toBe(201);

    const token = createAuthedUser(['members:manage']);
    const listRes = await request(app).get('/api/newsletter/signups').set('Authorization', `Bearer ${token}`);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].email).toBe('lea@test.com');
  });

  it('lehnt eine ungültige E-Mail-Adresse mit 400 ab', async () => {
    const res = await request(app).post('/api/newsletter/signup').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('ist idempotent - eine bereits angemeldete Adresse (case-insensitive) erzeugt keinen doppelten Eintrag', async () => {
    await request(app).post('/api/newsletter/signup').send({ email: 'lea@test.com' });
    const secondRes = await request(app).post('/api/newsletter/signup').send({ email: 'LEA@test.com' });
    expect(secondRes.status).toBe(201);

    const token = createAuthedUser(['members:manage']);
    const listRes = await request(app).get('/api/newsletter/signups').set('Authorization', `Bearer ${token}`);
    expect(listRes.body).toHaveLength(1);
  });

  it('GET /api/newsletter/signups - erfordert members:manage', async () => {
    const res = await request(app).get('/api/newsletter/signups');
    expect(res.status).toBe(401);

    const token = createAuthedUser(['tiles:write']);
    const forbiddenRes = await request(app).get('/api/newsletter/signups').set('Authorization', `Bearer ${token}`);
    expect(forbiddenRes.status).toBe(403);
  });

  it('DELETE /api/newsletter/signups/:id - löscht eine Anmeldung, 404 für unbekannte id', async () => {
    await request(app).post('/api/newsletter/signup').send({ email: 'lea@test.com' });
    const token = createAuthedUser(['members:manage']);
    const listRes = await request(app).get('/api/newsletter/signups').set('Authorization', `Bearer ${token}`);
    const id = listRes.body[0].id as string;

    const deleteRes = await request(app)
      .delete(`/api/newsletter/signups/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const notFoundRes = await request(app)
      .delete(`/api/newsletter/signups/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(notFoundRes.status).toBe(404);
  });
});
