import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';

process.env.SEPA_ENCRYPTION_KEY = '0'.repeat(64);

const { db } = await import('../db/connection.js');
const { default: membersRoutes } = await import('../routes/members-route.js');
const { default: settingsRoutes } = await import('../routes/settings-route.js');
const { default: sepaExportRoutes } = await import('../routes/sepa-export-route.js');

const app = express();
app.use(express.json());
app.use('/api', membersRoutes);
app.use('/api', settingsRoutes);
app.use('/api', sepaExportRoutes);

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
  db.exec('DELETE FROM settings; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users; DELETE FROM members;');
});

const setupCreditorAndFees = async (token: string) => {
  await request(app)
    .put('/api/settings/sepa-creditor')
    .set('Authorization', `Bearer ${token}`)
    .send({ creditorName: 'Skiclub Kapfenburg e.V.', creditorId: 'DE98ZZZ09999999999', iban: 'DE61614901500131470000' });
  await request(app)
    .put('/api/settings/membership-fee')
    .set('Authorization', `Bearer ${token}`)
    .send({ individual: 40, family: 70 });
};

const createMember = async (token: string, overrides: Record<string, unknown> = {}) =>
  request(app)
    .post('/api/members')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Max',
      lastName: 'Mustermann',
      isFamilyMembership: false,
      status: 'active',
      source: 'manual',
      memberSince: '2020-01-01',
      iban: 'DE02120300000000202051',
      ...overrides,
    });

describe('SEPA-Export Routes', () => {
  it('erfordert Anmeldung für Kandidaten/Vorschau/Export', async () => {
    expect((await request(app).get('/api/sepa-export/candidates')).status).toBe(401);
    expect((await request(app).post('/api/sepa-export/preview').send({ memberIds: ['x'] })).status).toBe(401);
    expect((await request(app).post('/api/sepa-export/generate').send({ memberIds: ['x'] })).status).toBe(401);
  });

  it('erfordert sepa:export, members:manage allein reicht nicht', async () => {
    const token = createAuthedUser(['members:manage']);
    expect((await request(app).get('/api/sepa-export/candidates').set('Authorization', `Bearer ${token}`)).status).toBe(
      403,
    );
  });

  it('listet aktive Mitglieder als Kandidaten mit hasIban-Flag', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    const withIban = await createMember(token, { firstName: 'Anna' });
    await createMember(token, { firstName: 'Ohne', iban: '' });

    const res = await request(app).get('/api/sepa-export/candidates').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const anna = res.body.find((c: any) => c.id === withIban.body.id);
    expect(anna.hasIban).toBe(true);
    const ohne = res.body.find((c: any) => c.firstName === 'Ohne');
    expect(ohne.hasIban).toBe(false);
  });

  it('bündelt eine Familiengruppe zu einer Transaktion zum Familientarif', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    await setupCreditorAndFees(token);

    const parent = await createMember(token, {
      firstName: 'Eltern',
      isFamilyMembership: true,
      familyGroupId: 'fam-1',
    });
    const child = await createMember(token, {
      firstName: 'Kind',
      isFamilyMembership: true,
      familyGroupId: 'fam-1',
      iban: '',
    });

    const preview = await request(app)
      .post('/api/sepa-export/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [parent.body.id, child.body.id] });

    expect(preview.status).toBe(200);
    expect(preview.body.transactions).toHaveLength(1);
    expect(preview.body.transactions[0].memberId).toBe(parent.body.id);
    expect(preview.body.transactions[0].amount).toBe(70);
    expect(preview.body.transactions[0].mandateReference).toBe(parent.body.id);
    expect(preview.body.warnings).toHaveLength(0);
  });

  it('warnt, wenn eine Familiengruppe keine IBAN hat', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    await setupCreditorAndFees(token);

    const child = await createMember(token, { isFamilyMembership: true, familyGroupId: 'fam-2', iban: '' });

    const preview = await request(app)
      .post('/api/sepa-export/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [child.body.id] });

    expect(preview.body.transactions).toHaveLength(0);
    expect(preview.body.warnings[0]).toContain('fam-2');
  });

  it('berechnet den Einzeltarif für Mitglieder ohne Familiengruppe', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    await setupCreditorAndFees(token);

    const single = await createMember(token);

    const preview = await request(app)
      .post('/api/sepa-export/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [single.body.id] });

    expect(preview.body.transactions).toEqual([
      expect.objectContaining({ memberId: single.body.id, amount: 40 }),
    ]);
  });

  it('lehnt die XML-Generierung ohne Gläubiger-ID ab', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    const single = await createMember(token);

    const res = await request(app)
      .post('/api/sepa-export/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [single.body.id], executionDate: '2026-10-01', sequenceType: 'FRST' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Gläubiger-ID');
  });

  it('generiert eine wohlgeformte pain.008-XML mit den erwarteten Kernfeldern', async () => {
    const token = createAuthedUser(['members:manage', 'sepa:export']);
    await setupCreditorAndFees(token);
    const single = await createMember(token, { firstName: 'Erika', lastName: 'Musterfrau' });

    const res = await request(app)
      .post('/api/sepa-export/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberIds: [single.body.id], executionDate: '2026-10-01', sequenceType: 'FRST' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.headers['content-disposition']).toContain('sepa-lastschrift-2026-10-01.xml');

    const xml = res.text;
    expect(xml).toContain('<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02"');
    expect(xml).toContain('<CdtrSchmeId>');
    expect(xml).toContain('<Id>DE98ZZZ09999999999</Id>');
    expect(xml).toContain('<IBAN>DE61614901500131470000</IBAN>');
    expect(xml).toContain('<IBAN>DE02120300000000202051</IBAN>');
    expect(xml).toContain('<InstdAmt Ccy="EUR">40.00</InstdAmt>');
    expect(xml).toContain('<SeqTp>FRST</SeqTp>');
    expect(xml).toContain('<ReqdColltnDt>2026-10-01</ReqdColltnDt>');
    expect(xml).toContain(`<MndtId>${single.body.id}</MndtId>`);
    expect(xml).toContain('Erika Musterfrau');

    // Well-formedness: every opening tag has a matching closing tag.
    const opens = xml.match(/<[A-Za-z][\w:]*(?:\s[^>]*)?>/g)?.length ?? 0;
    const closes = xml.match(/<\/[A-Za-z][\w:]*>/g)?.length ?? 0;
    const selfClosing = xml.match(/<[A-Za-z][\w:]*(?:\s[^>]*)?\/>/g)?.length ?? 0;
    expect(opens - selfClosing).toBe(closes);
  });
});
