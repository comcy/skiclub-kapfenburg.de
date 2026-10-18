import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

const { db } = await import('../db/connection.js');
const { default: imagesRoutes } = await import('../routes/images-route.js');

const app = express();
app.use(express.json());
app.use('/api', imagesRoutes);

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

// No DB table for images (see images-controller.ts) - these tests exercise
// the real media directory on disk, so every uploaded file is deleted again
// via the API itself by the end of each test rather than left behind.
describe('Images Routes', () => {
  it('POST /images/upload - erfordert Anmeldung', async () => {
    const res = await request(app).post('/api/images/upload').attach('image', Buffer.from('x'), 'a.png');
    expect(res.status).toBe(401);
  });

  it('POST /images/upload - erfordert tiles:write', async () => {
    const token = createAuthedUser([]);
    const res = await request(app)
      .post('/api/images/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('x'), 'a.png');
    expect(res.status).toBe(403);
  });

  it('lädt ein Bild hoch, listet es und löscht es wieder', async () => {
    const token = createAuthedUser(['tiles:write']);

    const uploadRes = await request(app)
      .post('/api/images/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('fake-png-bytes'), { filename: 'ski-logo.png', contentType: 'image/png' });
    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.filename).toMatch(/^image-.*\.png$/);
    // id must equal filename: it's what a tile's imageId round-trips, and
    // listImages()/deleteImage() key off the filename too.
    expect(uploadRes.body.id).toBe(uploadRes.body.filename);
    const filename = uploadRes.body.filename as string;

    const listRes = await request(app).get('/api/images').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((img: { filename: string }) => img.filename === filename)).toBe(true);

    const deleteRes = await request(app).delete(`/api/images/${filename}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const listAfterRes = await request(app).get('/api/images').set('Authorization', `Bearer ${token}`);
    expect(listAfterRes.body.some((img: { filename: string }) => img.filename === filename)).toBe(false);
  });

  it('GET /images - jeder angemeldete Nutzer, auch ohne tiles:write', async () => {
    const token = createAuthedUser([]);
    const res = await request(app).get('/api/images').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('DELETE /images/:filename - 404 für unbekannte Datei', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .delete('/api/images/does-not-exist.png')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('DELETE /images/:filename - Path-Traversal-Versuch bleibt auf mediaDir beschränkt', async () => {
    const token = createAuthedUser(['tiles:write']);
    // path.basename() strips the "../" segments server-side, so this can
    // only ever resolve to (and 404 on) a file named "passwd" inside
    // mediaDir - never anything outside it.
    const res = await request(app)
      .delete('/api/images/..%2F..%2F..%2Fetc%2Fpasswd')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
