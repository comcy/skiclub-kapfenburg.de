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

const VALID_SKI_COURSE_PRICING = {
  childUntilAge: 16,
  snowboard: { adult: { member: 55, nonMember: 70 }, child: { member: 45, nonMember: 60 } },
  alpine: { adult: { member: 60, nonMember: 75 }, child: { member: 50, nonMember: 65 } },
};

describe('Settings Routes - Ski-Kurs-Preise', () => {
  it('GET /api/settings/ski-course-pricing - ist öffentlich, Default wenn nichts gesetzt', async () => {
    const res = await request(app).get('/api/settings/ski-course-pricing');
    expect(res.status).toBe(200);
    expect(res.body.childUntilAge).toBe(16);
  });

  it('PUT /api/settings/ski-course-pricing - erfordert Anmeldung', async () => {
    const res = await request(app).put('/api/settings/ski-course-pricing').send(VALID_SKI_COURSE_PRICING);
    expect(res.status).toBe(401);
  });

  it('PUT /api/settings/ski-course-pricing - erfordert tiles:write', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .put('/api/settings/ski-course-pricing')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_SKI_COURSE_PRICING);
    expect(res.status).toBe(403);
  });

  it('speichert und liest die Ski-Kurs-Preise mit tiles:write', async () => {
    const token = createAuthedUser(['tiles:write']);

    const putRes = await request(app)
      .put('/api/settings/ski-course-pricing')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_SKI_COURSE_PRICING);
    expect(putRes.status).toBe(200);

    const getRes = await request(app).get('/api/settings/ski-course-pricing');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(VALID_SKI_COURSE_PRICING);
  });

  it('lehnt eine ungültige Ski-Kurs-Preisstruktur mit 400 ab', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .put('/api/settings/ski-course-pricing')
      .set('Authorization', `Bearer ${token}`)
      .send({ childUntilAge: 16 });
    expect(res.status).toBe(400);
  });
});

const VALID_TRIP_PRICING = {
  busLift: {
    adult: { member: 75, nonMember: 85 },
    youthUntil16: { member: 65, nonMember: 75 },
    childUntil6: { member: 50, nonMember: 55 },
  },
  busOnly: { member: 30, nonMember: 30 },
  addons: {
    courseBeginner: { member: 35, nonMember: 40 },
    technikHalf: { member: 35, nonMember: 40 },
    technikFull: { member: 60, nonMember: 65 },
    snowshoes: { member: 8, nonMember: 8 },
  },
};

describe('Settings Routes - Ausfahrten-Preise', () => {
  it('GET /api/settings/trip-pricing - ist öffentlich, leer wenn nichts gesetzt', async () => {
    const res = await request(app).get('/api/settings/trip-pricing');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });

  it('PUT /api/settings/trip-pricing - erfordert Anmeldung', async () => {
    const res = await request(app).put('/api/settings/trip-pricing').send(VALID_TRIP_PRICING);
    expect(res.status).toBe(401);
  });

  it('PUT /api/settings/trip-pricing - erfordert tiles:write', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .put('/api/settings/trip-pricing')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_TRIP_PRICING);
    expect(res.status).toBe(403);
  });

  it('speichert und liest die Ausfahrten-Preise mit tiles:write', async () => {
    const token = createAuthedUser(['tiles:write']);

    const putRes = await request(app)
      .put('/api/settings/trip-pricing')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_TRIP_PRICING);
    expect(putRes.status).toBe(200);

    const getRes = await request(app).get('/api/settings/trip-pricing');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(VALID_TRIP_PRICING);
  });

  it('lehnt eine ungültige Ausfahrten-Preisstruktur mit 400 ab', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .put('/api/settings/trip-pricing')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('"not-an-object"');
    expect(res.status).toBe(400);
  });
});
