import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';
import courseRegistrationsRoutes from '../routes/course-registrations-route.js';

const app = express();
app.use(express.json());
app.use('/api', courseRegistrationsRoutes);

const auth = (permissions: string[]): string => {
  const userId = randomUUID();
  db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(userId, `${userId}@test.com`);
  const token = randomBytes(16).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    createHash('sha256').update(token).digest('hex'),
    userId,
    new Date(Date.now() + 100000).toISOString(),
  );
  for (const p of permissions) db.prepare('INSERT INTO permissions (user_id, permission) VALUES (?, ?)').run(userId, p);
  return token;
};

const participate = (tileId: string, memberId: string): void => {
  db.prepare(
    "INSERT INTO trip_registrations (id, tile_id, first_name, last_name, member_id, status) VALUES (?, ?, 'T', 'T', ?, 'confirmed')",
  ).run(randomUUID(), tileId, memberId);
};

const member = (lastName: string, teaching: number): string => {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO members (id, first_name, last_name, email, status, source, is_family_membership, is_teaching_team) VALUES (?, 'Test', ?, ?, 'active', 'manual', 0, ?)",
  ).run(id, lastName, `${id}@example.com`, teaching);
  return id;
};

beforeEach(() => {
  db.exec(
    'DELETE FROM course_instructors; DELETE FROM trip_registrations; DELETE FROM members; DELETE FROM tiles; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;',
  );
});

describe('Übungsleiter je Kurs', () => {
  it('setzt, ersetzt und listet Übungsleiter getrennt je Sportart/Stufe', async () => {
    const tileId = randomUUID();
    db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'event', 'Ausfahrt')").run(tileId);
    const a = member('Adler', 1);
    const b = member('Brandt', 1);
    participate(tileId, a);
    participate(tileId, b);
    const token = auth(['tiles:write']);
    const put = (body: object) =>
      request(app).put(`/api/tiles/${tileId}/course-instructors`).set('Authorization', `Bearer ${token}`).send(body);

    await put({ sportType: 'Ski', level: 'A1', memberIds: [a, b] }).expect(200);
    await put({ sportType: 'Snowboard', level: 'B1', memberIds: [b] }).expect(200);
    const res = await put({ sportType: 'Ski', level: 'A1', memberIds: [a] }).expect(200);

    expect(res.body.map((i: any) => `${i.sportType}/${i.level}/${i.lastName}`)).toEqual([
      'Ski/A1/Adler',
      'Snowboard/B1/Brandt',
    ]);
  });

  it('Ausfahrt: nur Teilnehmer wählbar; Kurs-Kachel: jedes Lehrteam-Mitglied', async () => {
    const trip = randomUUID();
    const course = randomUUID();
    db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'event', 'Ausfahrt'), (?, 'course', 'Skikurs')").run(trip, course);
    const dabei = member('Dabei', 1);
    const fehlt = member('Fehlt', 1);
    participate(trip, dabei);
    const token = auth(['tiles:write']);
    const put = (tile: string, ids: string[]) =>
      request(app).put(`/api/tiles/${tile}/course-instructors`).set('Authorization', `Bearer ${token}`).send({ memberIds: ids });
    await put(trip, [dabei]).expect(200);
    await put(trip, [dabei, fehlt]).expect(400);
    await put(course, [fehlt]).expect(200);
  });

  it('lehnt Nicht-Lehrteam ab und verlangt tiles:write', async () => {
    const tileId = randomUUID();
    db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'course', 'Skikurs')").run(tileId);
    const plain = member('Normal', 0);
    const token = auth(['tiles:write']);
    await request(app)
      .put(`/api/tiles/${tileId}/course-instructors`)
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [plain] })
      .expect(400);
    await request(app)
      .put(`/api/tiles/${tileId}/course-instructors`)
      .set('Authorization', `Bearer ${auth([])}`)
      .send({ memberIds: [] })
      .expect(403);
  });
});
