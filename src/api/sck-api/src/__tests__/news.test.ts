import { jest } from '@jest/globals';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

// listMembershipApplications() liest registrations.ndjson - wie in members.test.ts gemockt.
const mockedListDataByType = jest.fn<(type: string) => unknown[]>();
jest.unstable_mockModule('../services/data-service', () => ({
  listDataByType: mockedListDataByType,
  getSepaCiphertext: jest.fn(),
  dataDir: '/tmp',
}));

const { db } = await import('../db/connection.js');
const { default: newsRoutes } = await import('../routes/news-route.js');

const app = express();
app.use(express.json());
app.use('/api', newsRoutes);

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const createAuthedUser = (permissions: string[], newsSince: string | null): string => {
  const userId = randomUUID();
  db.prepare('INSERT INTO users (id, email, news_since) VALUES (?, ?, ?)').run(userId, `${userId}@test.com`, newsSince);
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

const SINCE = '2026-10-20T10:00:00.000Z';

beforeEach(() => {
  db.exec(
    'DELETE FROM tile_seen; DELETE FROM trip_registrations; DELETE FROM course_registrations; DELETE FROM members; DELETE FROM tiles; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;',
  );
  mockedListDataByType.mockReset().mockReturnValue([]);
});

const addTile = (id: string, type: string): void => {
  db.prepare('INSERT INTO tiles (id, type, title) VALUES (?, ?, ?)').run(id, type, id);
};

describe('News Routes', () => {
  it('GET /api/news - erfordert Anmeldung', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(401);
  });

  it('zählt Anmeldungen und Anträge NACH newsSince, getrennt nach Art und Tile', async () => {
    addTile('trip-1', 'event');
    addTile('course-1', 'course');
    const insertTrip = db.prepare(
      "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, age_category, status, source, created_at) VALUES (?, 'trip-1', 'A', 'B', 'adult', 'confirmed', 'manual', ?)",
    );
    insertTrip.run('t1', '2026-10-20T09:59:59.000Z'); // davor
    insertTrip.run('t2', '2026-10-20T10:00:01.000Z');
    insertTrip.run('t3', '2026-10-21T08:00:00.000Z');
    db.prepare(
      "INSERT INTO course_registrations (id, tile_id, first_name, last_name, status, source, created_at) VALUES ('c1', 'course-1', 'C', 'D', 'confirmed', 'manual', '2026-10-20T12:00:00.000Z')",
    ).run();
    mockedListDataByType.mockReturnValue([
      { registrationId: 'old', timestamp: '2026-10-19T00:00:00.000Z', firstName: 'x', lastName: 'x', email: 'x@x.de' },
      { registrationId: 'new', timestamp: '2026-10-20T11:00:00.000Z', firstName: 'y', lastName: 'y', email: 'y@x.de' },
    ]);

    const token = createAuthedUser(['members:manage'], SINCE);
    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.since).toBe(SINCE);
    expect(res.body.trips).toEqual({ total: 2, byTile: { 'trip-1': 2 } });
    expect(res.body.courses).toEqual({ total: 1, byTile: { 'course-1': 1 } });
    expect(res.body.applications).toBe(1);
  });

  it('archivierte Tiles zählen nicht mit', async () => {
    addTile('trip-arch', 'event');
    db.prepare("UPDATE tiles SET archived_at = '2026-10-01T00:00:00.000Z' WHERE id = 'trip-arch'").run();
    db.prepare(
      "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, age_category, status, source, created_at) VALUES ('ta', 'trip-arch', 'A', 'B', 'adult', 'confirmed', 'manual', '2026-10-21T12:00:00.000Z')",
    ).run();
    const token = createAuthedUser([], SINCE);
    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);
    expect(res.body.trips.total).toBe(0);
  });

  it('Anträge nur mit members:manage - sonst null statt 0', async () => {
    const token = createAuthedUser([], SINCE);
    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);
    expect(res.body.applications).toBeNull();
  });

  it('ohne newsSince ist nichts neu (Basis = jetzt)', async () => {
    addTile('trip-1', 'event');
    db.prepare(
      "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, age_category, status, source) VALUES ('t1', 'trip-1', 'A', 'B', 'adult', 'confirmed', 'manual')",
    ).run();
    const token = createAuthedUser([], null);
    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);
    expect(res.body.trips.total).toBe(0);
  });

  it('POST /api/news/seen setzt die Basis auf jetzt - danach ist nichts mehr neu', async () => {
    addTile('trip-1', 'event');
    db.prepare(
      "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, age_category, status, source, created_at) VALUES ('t1', 'trip-1', 'A', 'B', 'adult', 'confirmed', 'manual', '2026-10-20T12:00:00.000Z')",
    ).run();
    const token = createAuthedUser([], SINCE);

    const before = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);
    expect(before.body.trips.total).toBe(1);

    const seen = await request(app).post('/api/news/seen').set('Authorization', `Bearer ${token}`);
    expect(seen.status).toBe(200);
    expect(new Date(seen.body.newsSince).getTime()).toBeGreaterThan(new Date(SINCE).getTime());

    const after = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);
    expect(after.body.trips.total).toBe(0);
  });

  it('Liste öffnen (POST /news/tiles/:id/seen): pro Admin nicht mehr neu, bei anderen weiterhin; neue Anmeldungen danach wieder neu', async () => {
    addTile('trip-1', 'event');
    addTile('trip-2', 'event');
    const insert = db.prepare(
      "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, age_category, status, source, created_at) VALUES (?, ?, 'A', 'B', 'adult', 'confirmed', 'manual', ?)",
    );
    insert.run('a1', 'trip-1', '2026-10-20T12:00:00.000Z');
    insert.run('b1', 'trip-2', '2026-10-20T12:00:00.000Z');
    const alice = createAuthedUser([], SINCE);
    const bob = createAuthedUser([], SINCE);

    const first = await request(app).post('/api/news/tiles/trip-1/seen').set('Authorization', `Bearer ${alice}`);
    expect(first.status).toBe(200);
    expect(first.body.previousSeenAt).toBeNull();

    const aliceNews = await request(app).get('/api/news').set('Authorization', `Bearer ${alice}`);
    expect(aliceNews.body.trips.byTile).toEqual({ 'trip-2': 1 }); // trip-1 gesehen
    expect(Object.keys(aliceNews.body.seen)).toEqual(['trip-1']);

    const bobNews = await request(app).get('/api/news').set('Authorization', `Bearer ${bob}`);
    expect(bobNews.body.trips.byTile).toEqual({ 'trip-1': 1, 'trip-2': 1 }); // Bob hat nichts geöffnet

    insert.run('a2', 'trip-1', new Date(Date.now() + 60_000).toISOString());
    const later = await request(app).get('/api/news').set('Authorization', `Bearer ${alice}`);
    expect(later.body.trips.byTile['trip-1']).toBe(1); // nur die neue

    const second = await request(app).post('/api/news/tiles/trip-1/seen').set('Authorization', `Bearer ${alice}`);
    expect(second.body.previousSeenAt).toBe(aliceNews.body.seen['trip-1']);
  });

  it('POST /news/tiles/:id/seen - 401 ohne Anmeldung, 404 für unbekannte Liste', async () => {
    expect((await request(app).post('/api/news/tiles/x/seen')).status).toBe(401);
    const token = createAuthedUser([], SINCE);
    expect((await request(app).post('/api/news/tiles/nope/seen').set('Authorization', `Bearer ${token}`)).status).toBe(404);
  });
});
