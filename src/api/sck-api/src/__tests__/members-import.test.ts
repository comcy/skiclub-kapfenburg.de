import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

process.env.SEPA_ENCRYPTION_KEY = '0'.repeat(64);

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

const attachJson = (req: request.Test, records: unknown) =>
  req.attach('file', Buffer.from(JSON.stringify(records)), 'members.json');

const sampleRecord = {
  Nr: '1046',
  Name: 'Fuchs Wuchs',
  Adresse_Raw: 'irrelevant',
  Adresse: 'Fuggerstraße 28, D-79545 Wuchshause',
  Eintrittsdatum: '26.03.1985',
  Kommunikation: { 'Tel 1': '0791/4997588', 'Tel 2': '', Mobil: '0170/9015944', 'E-Mail': 'fuchs.wuchs@test.com' },
  Bankdaten: {
    Bank: 'VR-Bank Blimmsbumm',
    BIC: 'GENODES1SXXX',
    IBAN: 'DE89370400440532013000',
    Kontoinhaber: 'Wuchs',
  },
  Zahlungsbedingung: 'SEPA-Lastschrift',
};

beforeEach(() => {
  db.exec('DELETE FROM members; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;');
});

describe('Members Import Routes', () => {
  it('POST /api/members/import/preview - erfordert members:manage', async () => {
    const token = createAuthedUser(['tiles:write']);
    const res = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    expect(res.status).toBe(403);
  });

  it('lehnt eine Nicht-Array-Datei mit 400 ab', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      { not: 'an array' },
    );
    expect(res.status).toBe(400);
  });

  it('führt einen neuen Datensatz als "neu" (nicht als Kollision), mappt Felder korrekt', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    expect(res.status).toBe(200);
    expect(res.body.neu).toHaveLength(1);
    expect(res.body.identisch).toBe(0);
    expect(res.body.kollisionen).toHaveLength(0);

    const mapped = res.body.neu[0];
    expect(mapped.firstName).toBe('Fuchs');
    expect(mapped.lastName).toBe('Wuchs');
    expect(mapped.email).toBe('fuchs.wuchs@test.com');
    expect(mapped.phone).toBe('0791/4997588');
    expect(mapped.mobile).toBe('0170/9015944');
    expect(mapped.memberSince).toBe('1985-03-26');
    expect(mapped.externalId).toBe('1046');
    expect(mapped.bankName).toBe('VR-Bank Blimmsbumm');
    expect(mapped.iban).toBe('DE89370400440532013000');
    expect(mapped.source).toBe('imported');
  });

  it('erkennt einen bereits identischen Datensatz per externalId und legt ihn nicht neu an', async () => {
    const token = createAuthedUser(['members:manage']);
    const preview1 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: preview1.body.importId, collisionOverrides: [] });

    const preview2 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    expect(preview2.body.neu).toHaveLength(0);
    expect(preview2.body.identisch).toBe(1);
    expect(preview2.body.kollisionen).toHaveLength(0);

    const listRes = await request(app).get('/api/members').set('Authorization', `Bearer ${token}`);
    expect(listRes.body.total).toBe(1);
  });

  it('meldet eine Kollision bei abweichendem Feld und übernimmt beim Apply nur den gewählten Wert', async () => {
    const token = createAuthedUser(['members:manage']);
    const preview1 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: preview1.body.importId, collisionOverrides: [] });

    const changedRecord = { ...sampleRecord, Adresse: 'Neue Straße 1, D-79545 Wuchshause' };
    const preview2 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [changedRecord],
    );
    expect(preview2.body.neu).toHaveLength(0);
    expect(preview2.body.identisch).toBe(0);
    expect(preview2.body.kollisionen).toHaveLength(1);

    const collision = preview2.body.kollisionen[0];
    expect(collision.diffFields).toHaveLength(1);
    expect(collision.diffFields[0].field).toBe('address');
    expect(collision.diffFields[0].existing).toBe('Fuggerstraße 28, D-79545 Wuchshause');
    expect(collision.diffFields[0].incoming).toBe('Neue Straße 1, D-79545 Wuchshause');

    const applyRes = await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({
        importId: preview2.body.importId,
        collisionOverrides: [{ memberId: collision.memberId, fields: { address: 'Neue Straße 1, D-79545 Wuchshause' } }],
      });
    expect(applyRes.status).toBe(200);
    expect(applyRes.body).toEqual({ created: 0, updated: 1 });

    const getRes = await request(app)
      .get(`/api/members/${collision.memberId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.body.address).toBe('Neue Straße 1, D-79545 Wuchshause');
    // IBAN wasn't part of the override, so it must survive the update untouched.
    expect(getRes.body.iban).toBe('DE89370400440532013000');
  });

  it('lässt eine Kollision ohne Override unangetastet ("bestehend behalten")', async () => {
    const token = createAuthedUser(['members:manage']);
    const preview1 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: preview1.body.importId, collisionOverrides: [] });

    const changedRecord = { ...sampleRecord, Adresse: 'Neue Straße 1, D-79545 Wuchshause' };
    const preview2 = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [changedRecord],
    );
    const collision = preview2.body.kollisionen[0];

    const applyRes = await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: preview2.body.importId, collisionOverrides: [] });
    expect(applyRes.body).toEqual({ created: 0, updated: 0 });

    const getRes = await request(app)
      .get(`/api/members/${collision.memberId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.body.address).toBe('Fuggerstraße 28, D-79545 Wuchshause');
  });

  it('IBAN wird verschlüsselt gespeichert und beim Lesen wieder korrekt entschlüsselt', async () => {
    const token = createAuthedUser(['members:manage']);
    const preview = await attachJson(
      request(app).post('/api/members/import/preview').set('Authorization', `Bearer ${token}`),
      [sampleRecord],
    );
    await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: preview.body.importId, collisionOverrides: [] });

    const row = db.prepare('SELECT iban_encrypted FROM members').get() as { iban_encrypted: string };
    expect(row.iban_encrypted).not.toContain('DE89370400440532013000');
    expect(row.iban_encrypted.split(':')).toHaveLength(3);

    const listRes = await request(app).get('/api/members').set('Authorization', `Bearer ${token}`);
    expect(listRes.body.items[0].iban).toBe('DE89370400440532013000');
  });

  it('POST /api/members/import/apply - unbekannte importId liefert 400', async () => {
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .post('/api/members/import/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ importId: 'does-not-exist', collisionOverrides: [] });
    expect(res.status).toBe(400);
  });
});
