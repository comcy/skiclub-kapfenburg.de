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
