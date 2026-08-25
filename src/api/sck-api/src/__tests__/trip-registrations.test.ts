import { jest } from '@jest/globals';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';

// requireTurnstile fails open unless this is set (see turnstile-middleware.ts)
// - a static top-level `import` of the route below would be hoisted before
// this line runs, so the route (and therefore the middleware) is imported
// dynamically instead, same pattern as the other route test files.
process.env.TURNSTILE_SECRET_KEY = 'test-secret';
const { default: tripRegistrationsRoutes } = await import('../routes/trip-registrations-route.js');

const app = express();
app.use(express.json());
// requireTurnstile now gates POST /tiles/:tileId/registrations/public (see
// routes/trip-registrations-route.ts) - auto-fill a token on every request
// here instead of touching each of this file's many .send() calls; the
// middleware's own behavior is covered by turnstile.test.ts, and Cloudflare's
// verify call is mocked to always succeed below.
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') (req.body as Record<string, unknown>).turnstileToken = 'test-token';
  next();
});
app.use('/api', tripRegistrationsRoutes);

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

const createTile = (capacity?: number): string => {
  const id = randomUUID();
  db.prepare("INSERT INTO tiles (id, type, title, capacity) VALUES (?, 'event', 'Skifahrt Ischgl', ?)").run(
    id,
    capacity ?? null,
  );
  return id;
};

const createTileWithState = (status: 'canceled' | 'open', expiration?: string): string => {
  const id = randomUUID();
  db.prepare('INSERT INTO tiles (id, type, title, status, expiration) VALUES (?, ?, ?, ?, ?)').run(
    id,
    'event',
    'Skifahrt Ischgl',
    status,
    expiration ?? '',
  );
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

  describe('POST /api/tiles/:tileId/registrations/public', () => {
    it('ist öffentlich (keine Anmeldung nötig) und bestätigt, solange Kapazität frei ist', async () => {
      const tileId = createTile(2);
      const res = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Max', lastName: 'Mustermann', birthday: '1990-01-01' }] });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ status: 'confirmed' });

      const list = await request(app)
        .get(`/api/tiles/${tileId}/registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body).toHaveLength(1);
      expect(list.body[0].source).toBe('sheet-import');
      expect(list.body[0].ageCategory).toBe('adult');
    });

    it('leitet die Alterskategorie korrekt aus dem Geburtsdatum ab', async () => {
      const tileId = createTile(10);
      const token = createAuthedUser(['tiles:write']);
      await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({
          participants: [
            { firstName: 'Klein', lastName: 'Kind', birthday: new Date().toISOString().slice(0, 10) },
            { firstName: 'Jugendlich', lastName: 'Person', birthday: '2015-01-01' },
            { firstName: 'Erwachsen', lastName: 'Person', birthday: '1980-01-01' },
          ],
        });

      const list = await request(app).get(`/api/tiles/${tileId}/registrations`).set('Authorization', `Bearer ${token}`);
      const byName = (name: string) => list.body.find((r: any) => r.firstName === name);
      expect(byName('Klein').ageCategory).toBe('childUntil6');
      expect(byName('Jugendlich').ageCategory).toBe('youthUntil16');
      expect(byName('Erwachsen').ageCategory).toBe('adult');
    });

    it('setzt weitere Anmeldungen auf die Warteliste, sobald die Kapazität erreicht ist, mit korrekter Position', async () => {
      const tileId = createTile(1);
      const token = createAuthedUser(['tiles:write']);

      const firstRes = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Erste', lastName: 'Person' }] });
      expect(firstRes.body.status).toBe('confirmed');

      const secondRes = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Zweite', lastName: 'Person' }] });
      expect(secondRes.body).toEqual({ status: 'waitlist', waitlistPosition: 1, waitlistCount: 1 });

      const thirdRes = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Dritte', lastName: 'Person' }] });
      expect(thirdRes.body).toEqual({ status: 'waitlist', waitlistPosition: 2, waitlistCount: 1 });

      const list = await request(app).get(`/api/tiles/${tileId}/registrations`).set('Authorization', `Bearer ${token}`);
      expect(list.body.filter((r: any) => r.status === 'confirmed')).toHaveLength(1);
      expect(list.body.filter((r: any) => r.status === 'waitlist')).toHaveLength(2);
    });

    it('haelt eine Gruppenanmeldung zusammen (alle bestaetigt oder alle Warteliste)', async () => {
      const tileId = createTile(2);
      const res = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({
          participants: [
            { firstName: 'A', lastName: 'Familie' },
            { firstName: 'B', lastName: 'Familie' },
            { firstName: 'C', lastName: 'Familie' },
          ],
        });

      // 3 participants, only 2 slots -> the whole group waits together, none confirmed individually.
      expect(res.body).toEqual({ status: 'waitlist', waitlistPosition: 1, waitlistCount: 3 });
    });

    it('lehnt eine leere Teilnehmerliste mit 400 ab', async () => {
      const tileId = createTile();
      const res = await request(app).post(`/api/tiles/${tileId}/registrations/public`).send({ participants: [] });
      expect(res.status).toBe(400);
    });

    it('lehnt eine fehlende participants-Liste mit 400 ab', async () => {
      const tileId = createTile();
      const res = await request(app).post(`/api/tiles/${tileId}/registrations/public`).send({});
      expect(res.status).toBe(400);
    });

    it('lehnt die gesamte Gruppe mit 400 ab, wenn auch nur ein Teilnehmer ungueltig ist', async () => {
      const tileId = createTile(10);
      const res = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({
          participants: [
            { firstName: 'Gueltig', lastName: 'Person' },
            { firstName: '', lastName: 'Ohne Vornamen' },
          ],
        });
      expect(res.status).toBe(400);

      const list = await request(app)
        .get(`/api/tiles/${tileId}/registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body).toHaveLength(0);
    });

    it('lehnt mehr als 20 Teilnehmer pro Anfrage mit 400 ab', async () => {
      const tileId = createTile(100);
      const participants = Array.from({ length: 21 }, (_, i) => ({ firstName: `P${i}`, lastName: 'Test' }));

      const res = await request(app).post(`/api/tiles/${tileId}/registrations/public`).send({ participants });

      expect(res.status).toBe(400);
      const list = await request(app)
        .get(`/api/tiles/${tileId}/registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body).toHaveLength(0);
    });

    it('lehnt eine Anmeldung fuer eine abgesagte Ausfahrt mit 400 ab', async () => {
      const tileId = createTileWithState('canceled');
      const res = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Max', lastName: 'Mustermann' }] });

      expect(res.status).toBe(400);
    });

    it('lehnt eine Anmeldung fuer eine bereits vergangene Ausfahrt mit 400 ab', async () => {
      const tileId = createTileWithState('open', '2000-01-01T00:00:00.000Z');
      const res = await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({ participants: [{ firstName: 'Max', lastName: 'Mustermann' }] });

      expect(res.status).toBe(400);
    });

    it('liefert 404 für eine unbekannte Ausfahrt', async () => {
      const res = await request(app)
        .post(`/api/tiles/${randomUUID()}/registrations/public`)
        .send({ participants: [{ firstName: 'Max', lastName: 'Mustermann' }] });
      expect(res.status).toBe(404);
    });

    it('bestaetigt immer, wenn die Ausfahrt keine Kapazitaetsgrenze hat (capacity = null)', async () => {
      const tileId = createTile(); // no capacity -> unlimited
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post(`/api/tiles/${tileId}/registrations/public`)
          .send({ participants: [{ firstName: `Person${i}`, lastName: 'Test' }] });
        expect(res.body).toEqual({ status: 'confirmed' });
      }
    });

    it('loest einen bekannten Zustiegsort (case-insensitive) auf boardingId auf, unbekannte bleiben leer', async () => {
      const tileId = createTile(10);
      const token = createAuthedUser(['tiles:write']);
      const boardingId = randomUUID();
      db.prepare('INSERT INTO boardings (id, name) VALUES (?, ?)').run(boardingId, 'Hauptbahnhof');

      await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({
          participants: [
            { firstName: 'Bekannt', lastName: 'Person', boarding: 'hauptbahnhof' },
            { firstName: 'Unbekannt', lastName: 'Person', boarding: 'Irgendwo' },
          ],
        });

      const list = await request(app).get(`/api/tiles/${tileId}/registrations`).set('Authorization', `Bearer ${token}`);
      const byName = (name: string) => list.body.find((r: any) => r.firstName === name);
      expect(byName('Bekannt').boardingId).toBe(boardingId);
      expect(byName('Bekannt').boardingName).toBe('Hauptbahnhof');
      expect(byName('Unbekannt').boardingId).toBeUndefined();
    });

    it('setzt die Alterskategorie-Grenzen exakt bei 6/7 und 16/17 Jahren', async () => {
      const tileId = createTile(10);
      const token = createAuthedUser(['tiles:write']);
      const birthdateForAge = (age: number): string => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - age);
        return d.toISOString().slice(0, 10);
      };

      await request(app)
        .post(`/api/tiles/${tileId}/registrations/public`)
        .send({
          participants: [
            { firstName: 'AgeSix', lastName: 'Test', birthday: birthdateForAge(6) },
            { firstName: 'AgeSeven', lastName: 'Test', birthday: birthdateForAge(7) },
            { firstName: 'AgeSixteen', lastName: 'Test', birthday: birthdateForAge(16) },
            { firstName: 'AgeSeventeen', lastName: 'Test', birthday: birthdateForAge(17) },
          ],
        });

      const list = await request(app).get(`/api/tiles/${tileId}/registrations`).set('Authorization', `Bearer ${token}`);
      const byName = (name: string) => list.body.find((r: any) => r.firstName === name);
      expect(byName('AgeSix').ageCategory).toBe('childUntil6');
      expect(byName('AgeSeven').ageCategory).toBe('youthUntil16');
      expect(byName('AgeSixteen').ageCategory).toBe('youthUntil16');
      expect(byName('AgeSeventeen').ageCategory).toBe('adult');
    });
  });
});
