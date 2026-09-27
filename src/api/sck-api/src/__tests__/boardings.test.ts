import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: boardingsRoutes } = await import('../routes/boardings-route.js');

const app = express();
app.use(express.json());
app.use('/api', boardingsRoutes);

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
  db.exec('DELETE FROM trip_boardings; DELETE FROM boardings; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

describe('Boardings Routes', () => {
  it('GET /api/boardings - ist öffentlich', async () => {
    const res = await request(app).get('/api/boardings');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [], total: 0 });
  });

  it('POST /api/boardings - erfordert boardings:write', async () => {
    const res = await request(app).post('/api/boardings').send({ name: 'Testort' });
    expect(res.status).toBe(401);
  });

  it('erstellt, aktualisiert und löscht ein Boarding mit boardings:write', async () => {
    const token = createAuthedUser(['boardings:write']);

    const createRes = await request(app)
      .post('/api/boardings')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Testort (5:00 Uhr)' });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id as string;

    const updateRes = await request(app)
      .put(`/api/boardings/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Testort (5:30 Uhr)' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Testort (5:30 Uhr)');

    const deleteRes = await request(app).delete(`/api/boardings/${id}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);
  });

  it('lehnt doppelte Namen mit 409 ab', async () => {
    const token = createAuthedUser(['boardings:write']);
    await request(app).post('/api/boardings').set('Authorization', `Bearer ${token}`).send({ name: 'Doppelt' });

    const res = await request(app).post('/api/boardings').set('Authorization', `Bearer ${token}`).send({ name: 'Doppelt' });
    expect(res.status).toBe(409);
  });
});
