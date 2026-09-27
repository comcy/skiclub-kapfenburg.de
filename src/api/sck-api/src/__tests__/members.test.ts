import { jest } from '@jest/globals';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

// listMembershipApplications() reads registrations.ndjson via data-service's
// listDataByType() — mocked the same way membership.test.ts mocks saveData,
// so these tests never touch the real (git-tracked) file on disk.
const mockedListDataByType = jest.fn();
jest.unstable_mockModule('../services/data-service', () => ({
  listDataByType: mockedListDataByType,
  dataDir: '/tmp',
}));

const { db } = await import('../db/connection.js');
const { default: membersRoutes } = await import('../routes/members-route.js');

const app = express();
app.use(express.json());
app.use('/api', membersRoutes);

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

const validMember = {
  firstName: 'Anna',
  lastName: 'Mayer',
  email: 'anna.mayer@test.com',
  status: 'active',
  source: 'manual',
  isFamilyMembership: false,
};

beforeEach(() => {
  db.exec('DELETE FROM members; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
  mockedListDataByType.mockReset();
});

describe('Members Routes', () => {
  it('GET /api/members - erfordert Anmeldung (anders als Boardings, keine öffentlichen Reads)', async () => {
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(401);
  });

  it('GET /api/members - erfordert members:manage, auch für einen sonst angemeldeten Nutzer', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app).get('/api/members').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('erstellt, listet, aktualisiert und löscht ein Mitglied mit members:manage', async () => {
    const token = createAuthedUser(['members:manage']);

    const createRes = await request(app).post('/api/members').set('Authorization', `Bearer ${token}`).send(validMember);
    expect(createRes.status).toBe(201);
    const id = createRes.body.id as string;

    const listRes = await request(app).get('/api/members').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.total).toBe(1);
    expect(listRes.body.items[0].firstName).toBe('Anna');

    const updateRes = await request(app)
      .put(`/api/members/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, status: 'inactive' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('inactive');

    const deleteRes = await request(app).delete(`/api/members/${id}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);
  });

  it('lehnt ein Mitglied ohne Vor-/Nachname mit 400 ab', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: '', lastName: '', status: 'active', source: 'manual', isFamilyMembership: false });
    expect(res.status).toBe(400);
  });

  it('GET /api/members/applications - blendet bereits übernommene Anträge aus', async () => {
    const token = createAuthedUser(['members:manage']);

    mockedListDataByType.mockReturnValue([
      { registrationId: 'reg-open', firstName: 'Markus', lastName: 'Huber', email: 'markus@test.com' },
      { registrationId: 'reg-promoted', firstName: 'Sophie', lastName: 'Bauer', email: 'sophie@test.com' },
    ]);

    // Simulate reg-promoted already having been turned into a member.
    await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, applicationRegistrationId: 'reg-promoted' });

    const res = await request(app).get('/api/members/applications').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].registrationId).toBe('reg-open');
    expect(res.body[0].confirmed).toBe(false);
    expect(mockedListDataByType).toHaveBeenCalledWith('membership-registration');
  });

  it('GET /api/members/anniversaries - meldet jeden, der mindestens N Jahre dabei und dafür noch nicht geehrt ist', async () => {
    const token = createAuthedUser(['members:manage']);
    await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, firstName: 'Lea', memberSince: '2001-09-01' });
    await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, firstName: 'Tom', memberSince: '1986-01-15' });
    await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, firstName: 'Ohne Datum', memberSince: undefined });

    const res = await request(app)
      .get('/api/members/anniversaries')
      .query({ date: '2026-06-01', years: '25,40' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Tom (seit 1986) ist auch für die 25-Jahre-Abfrage dabei - über 25
    // Jahre Mitglied UND noch nicht für 25 Jahre geehrt zählt genauso wie
    // "genau" 25 Jahre.
    expect(res.body[0]).toEqual(
      expect.objectContaining({
        years: 25,
        cutoffYear: 2001,
        members: expect.arrayContaining([
          expect.objectContaining({ firstName: 'Lea' }),
          expect.objectContaining({ firstName: 'Tom' }),
        ]),
      }),
    );
    expect(res.body[0].members).toHaveLength(2);
    expect(res.body[1]).toEqual({
      years: 40,
      cutoffYear: 1986,
      members: [expect.objectContaining({ firstName: 'Tom' })],
    });
  });

  it('GET /api/members/anniversaries - blendet bereits geehrte Mitglieder für dieses Jahr aus', async () => {
    const token = createAuthedUser(['members:manage']);
    const createRes = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validMember, firstName: 'Tom', memberSince: '1986-01-15' });
    const id = createRes.body.id as string;

    const honorRes = await request(app)
      .post(`/api/members/${id}/honor`)
      .set('Authorization', `Bearer ${token}`)
      .send({ years: 25 });
    expect(honorRes.status).toBe(200);
    expect(honorRes.body.honoredYears).toEqual([25]);

    const res = await request(app)
      .get('/api/members/anniversaries')
      .query({ date: '2026-06-01', years: '25,40' })
      .set('Authorization', `Bearer ${token}`);

    // Für 25 Jahre bereits geehrt -> taucht dort nicht mehr auf, für 40
    // Jahre (noch nicht geehrt) weiterhin.
    expect(res.body[0]).toEqual({ years: 25, cutoffYear: 2001, members: [] });
    expect(res.body[1].members).toEqual([expect.objectContaining({ firstName: 'Tom' })]);
  });

  it('POST /api/members/:id/honor - ist idempotent und liefert 404 für unbekannte id', async () => {
    const token = createAuthedUser(['members:manage']);
    const createRes = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send(validMember);
    const id = createRes.body.id as string;

    await request(app).post(`/api/members/${id}/honor`).set('Authorization', `Bearer ${token}`).send({ years: 25 });
    const secondRes = await request(app)
      .post(`/api/members/${id}/honor`)
      .set('Authorization', `Bearer ${token}`)
      .send({ years: 25 });
    expect(secondRes.body.honoredYears).toEqual([25]);

    const notFoundRes = await request(app)
      .post('/api/members/does-not-exist/honor')
      .set('Authorization', `Bearer ${token}`)
      .send({ years: 25 });
    expect(notFoundRes.status).toBe(404);
  });

  it('GET /api/members/anniversaries - lehnt fehlende Parameter mit 400 ab', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app).get('/api/members/anniversaries').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('GET /api/members/applications - markiert bestätigte Anträge als confirmed', async () => {
    const token = createAuthedUser(['members:manage']);

    mockedListDataByType.mockReturnValue([
      { registrationId: 'reg-confirmed', firstName: 'Lea', lastName: 'Fischer', email: 'lea@test.com' },
    ]);
    db.prepare(
      "INSERT INTO membership_confirmation_tokens (token_hash, registration_id, expires_at, confirmed_at) VALUES ('hash-1', 'reg-confirmed', ?, ?)",
    ).run(new Date(Date.now() + 100000).toISOString(), new Date().toISOString());

    const res = await request(app).get('/api/members/applications').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body[0].confirmed).toBe(true);
  });
});
