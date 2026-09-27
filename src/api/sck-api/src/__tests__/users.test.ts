import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: usersRoutes } = await import('../routes/users-route.js');

const app = express();
app.use(express.json());
app.use('/api', usersRoutes);

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
  db.exec('DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

// listUsers/updateUserPermissions predate this test file and aren't covered
// here — this only exercises what's new: the lighter directory endpoint the
// tile-editor's organizer picker needs (see Phase 2 of the trip-registration
// plan).
describe('GET /api/users/directory', () => {
  it('erfordert Anmeldung', async () => {
    const res = await request(app).get('/api/users/directory');
    expect(res.status).toBe(401);
  });

  it('ist für jeden angemeldeten Nutzer erreichbar, auch ohne users:manage', async () => {
    const token = createAuthedUser(['tiles:write']);
    db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(randomUUID(), 'organizer@test.com');

    const res = await request(app).get('/api/users/directory').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some((u: { email: string }) => u.email === 'organizer@test.com')).toBe(true);
    // Only id/email — no permissions or lastLoginAt leaked to a non-users:manage caller.
    expect(res.body[0]).toEqual({ id: expect.any(String), email: expect.any(String) });
  });
});
