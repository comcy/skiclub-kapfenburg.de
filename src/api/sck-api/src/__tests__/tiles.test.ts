import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: tilesRoutes } = await import('../routes/tiles-route.js');

const app = express();
app.use(express.json());
app.use('/api', tilesRoutes);

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

const validTilePayload = {
  order: 1,
  type: 'info',
  title: 'Test Tile',
  date: '',
  subTitle: '',
  image: '',
  imageDescription: '',
  description: '',
  status: 'open',
  expiration: '',
  behavior: 'view',
  boardings: [] as string[],
  actions: [] as string[],
  visible: true,
};

beforeEach(() => {
  db.exec(
    'DELETE FROM trip_boardings; DELETE FROM tiles; DELETE FROM boardings; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;',
  );
});

describe('Tiles Routes', () => {
  it('GET /api/tiles - ist öffentlich und liefert eine leere, paginierte Liste', async () => {
    const res = await request(app).get('/api/tiles');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [], total: 0 });
  });

  it('POST /api/tiles - erfordert Anmeldung', async () => {
    const res = await request(app).post('/api/tiles').send(validTilePayload);
    expect(res.status).toBe(401);
  });

  it('POST /api/tiles - erfordert die Berechtigung tiles:write', async () => {
    const token = createAuthedUser([]);
    const res = await request(app).post('/api/tiles').set('Authorization', `Bearer ${token}`).send(validTilePayload);
    expect(res.status).toBe(403);
  });

  it('POST /api/tiles - lehnt ungültige Payloads ab', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .post('/api/tiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validTilePayload, title: '' });
    expect(res.status).toBe(400);
  });

  it('erstellt, liest, aktualisiert und löscht ein Tile mit tiles:write', async () => {
    const token = createAuthedUser(['tiles:write']);

    const createRes = await request(app).post('/api/tiles').set('Authorization', `Bearer ${token}`).send(validTilePayload);
    expect(createRes.status).toBe(201);
    expect(createRes.body.title).toBe('Test Tile');
    const id = createRes.body.id as string;

    const getRes = await request(app).get(`/api/tiles/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe('Test Tile');

    const putRes = await request(app)
      .put(`/api/tiles/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...createRes.body, title: 'Updated title' });
    expect(putRes.status).toBe(200);
    expect(putRes.body.title).toBe('Updated title');

    const deleteRes = await request(app).delete(`/api/tiles/${id}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const getAfterDelete = await request(app).get(`/api/tiles/${id}`);
    expect(getAfterDelete.status).toBe(404);
  });

  it('rundet capacity, organizerUserId und tripConfig (Phase 2) korrekt', async () => {
    const token = createAuthedUser(['tiles:write']);
    const organizerId = randomUUID();
    db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(organizerId, 'organizer@test.com');

    const tripConfig = { pricing: { busOnly: { member: 30, nonMember: 40 } } };
    const createRes = await request(app)
      .post('/api/tiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validTilePayload, capacity: 40, organizerUserId: organizerId, tripConfig });

    expect(createRes.status).toBe(201);
    expect(createRes.body.capacity).toBe(40);
    expect(createRes.body.organizerUserId).toBe(organizerId);
    expect(createRes.body.tripConfig).toEqual(tripConfig);

    // A tile with no capacity set stays unlimited (undefined), not 0/null leaking through.
    const unlimitedRes = await request(app)
      .post('/api/tiles')
      .set('Authorization', `Bearer ${token}`)
      .send(validTilePayload);
    expect(unlimitedRes.body.capacity).toBeUndefined();
  });

  it('PUT /api/tiles/:id/boardings - ordnet Boardings anhand ihres Namens zu', async () => {
    const token = createAuthedUser(['tiles:write']);

    const createRes = await request(app).post('/api/tiles').set('Authorization', `Bearer ${token}`).send(validTilePayload);
    const id = createRes.body.id as string;

    const boardingId = randomUUID();
    db.prepare('INSERT INTO boardings (id, name) VALUES (?, ?)').run(boardingId, 'Westhausen Turnhalle (5:15 Uhr)');

    const assignRes = await request(app)
      .put(`/api/tiles/${id}/boardings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ boardings: ['Westhausen Turnhalle (5:15 Uhr)'] });

    expect(assignRes.status).toBe(200);
    expect(assignRes.body.boardings).toEqual(['Westhausen Turnhalle (5:15 Uhr)']);
  });
});
