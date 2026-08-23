import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';
import tripRegistrationsRoutes from '../routes/trip-registrations-route.js';

const app = express();
app.use(express.json());
app.use('/api', tripRegistrationsRoutes);

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

const createTile = (): string => {
  const id = randomUUID();
  db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'event', 'Skifahrt Ischgl')").run(id);
  return id;
};

const validRegistration = {
  firstName: 'Lisa',
  lastName: 'Berger',
  ageCategory: 'adult',
  status: 'confirmed',
  source: 'manual',
  orderIndex: 0,
};

beforeEach(() => {
  db.exec(
    'DELETE FROM trip_registrations; DELETE FROM members; DELETE FROM boardings; DELETE FROM tiles; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;',
  );
});

describe('Trip Registrations Routes', () => {
  it('GET /api/tiles/:tileId/registrations - erfordert Anmeldung', async () => {
    const tileId = createTile();
    const res = await request(app).get(`/api/tiles/${tileId}/registrations`);
    expect(res.status).toBe(401);
  });

  it('POST - erfordert tiles:write, auch für einen sonst angemeldeten Nutzer', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .post(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send(validRegistration);
    expect(res.status).toBe(403);
  });

  it('erstellt, listet, aktualisiert und löscht eine Anmeldung mit tiles:write', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);

    const createRes = await request(app)
      .post(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send(validRegistration);
    expect(createRes.status).toBe(201);
    expect(createRes.body.isMember).toBe(false);
    const id = createRes.body.id as string;

    const listRes = await request(app)
      .get(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].firstName).toBe('Lisa');

    const updateRes = await request(app)
      .put(`/api/registrations/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, status: 'waitlist' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('waitlist');

    const deleteRes = await request(app).delete(`/api/registrations/${id}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const listAfter = await request(app)
      .get(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`);
    expect(listAfter.body).toHaveLength(0);
  });

  it('lehnt eine Anmeldung ohne Vor-/Nachname mit 400 ab', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .post(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, firstName: '', lastName: '' });
    expect(res.status).toBe(400);
  });

  it('gleicht per E-Mail automatisch mit der Mitgliederliste ab und löst den Boarding-Namen auf', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);

    const memberId = randomUUID();
    db.prepare(
      "INSERT INTO members (id, first_name, last_name, email, status, source) VALUES (?, 'Lisa', 'Berger', 'lisa@test.com', 'active', 'manual')",
    ).run(memberId);
    const boardingId = randomUUID();
    db.prepare('INSERT INTO boardings (id, name) VALUES (?, ?)').run(boardingId, 'Hauptbahnhof');

    const createRes = await request(app)
      .post(`/api/tiles/${tileId}/registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, email: 'lisa@test.com', boardingId });

    expect(createRes.status).toBe(201);
    expect(createRes.body.isMember).toBe(true);
    expect(createRes.body.memberId).toBe(memberId);
    expect(createRes.body.boardingName).toBe('Hauptbahnhof');
  });
});
