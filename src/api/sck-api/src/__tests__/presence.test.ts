import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';
import presenceRoutes from '../routes/presence-route.js';

const app = express();
app.use(express.json());
app.use('/api', presenceRoutes);

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const createSession = (email: string): string => {
  const userId = randomUUID();
  db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(userId, email);
  const token = randomBytes(16).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashToken(token),
    userId,
    new Date(Date.now() + 100000).toISOString(),
  );
  return token;
};

describe('POST /api/presence', () => {
  it('verlangt Anmeldung', async () => {
    expect((await request(app).post('/api/presence').send({})).status).toBe(401);
  });

  it('liefert aktive Admins mit Kürzel, Name und Seite; Inaktive fehlen', async () => {
    const a = createSession('anna.beispiel@test.com');
    const b = createSession('bernd@test.com');
    const stale = createSession('alt.nutzer@test.com');
    db.prepare("UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?").run(
      new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      hashToken(stale),
    );

    await request(app).post('/api/presence').set('Authorization', `Bearer ${b}`).send({ page: '/settings/general?x=1' });
    const res = await request(app)
      .post('/api/presence')
      .set('Authorization', `Bearer ${a}`)
      .send({ page: '/registrations/ausfahrten/abc' });

    expect(res.status).toBe(200);
    const names = res.body.online.map((u: { name: string }) => u.name);
    expect(names).toContain('Anna Beispiel');
    expect(names).toContain('Bernd');
    expect(names).not.toContain('Alt Nutzer');
    const anna = res.body.online.find((u: { name: string }) => u.name === 'Anna Beispiel');
    expect(anna.initials).toBe('AB');
    expect(anna.page).toBe('/registrations/ausfahrten/abc');
    expect(res.body.online.find((u: { name: string }) => u.name === 'Bernd').page).toBe('/settings/general');
  });
});
