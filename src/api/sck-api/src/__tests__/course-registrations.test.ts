import { jest } from '@jest/globals';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { db } from '../db/connection.js';

// sendMail() only calls out to nodemailer when SMTP_SERVER is set (see
// mailer.ts's dev-log fallback branch) - set it before the route (which
// transitively imports mailer.ts) is loaded, so the mocked transporter below
// is actually exercised instead of the console.log dev branch.
process.env.SMTP_SERVER = 'smtp.test.local';
const mockedSendMail = jest.fn();
const mockedCreateTransport = jest.fn();
jest.unstable_mockModule('nodemailer', () => ({
  default: { createTransport: mockedCreateTransport },
}));

const { default: courseRegistrationsRoutes } = await import('../routes/course-registrations-route.js');

const app = express();
app.use(express.json());
app.use('/api', courseRegistrationsRoutes);

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

const createTile = (): string => {
  const id = randomUUID();
  db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'course', 'Skikurs Anfänger')").run(id);
  return id;
};

const validRegistration = {
  firstName: 'Lisa',
  lastName: 'Berger',
  sportType: 'Ski Alpin',
  level: 'Anfänger',
  birthday: '2016-05-03',
  status: 'confirmed',
  source: 'manual',
  orderIndex: 0,
};

beforeEach(() => {
  db.exec(
    'DELETE FROM course_registrations; DELETE FROM course_groups; DELETE FROM members; DELETE FROM tiles; DELETE FROM permissions; DELETE FROM sessions; DELETE FROM users;',
  );
  mockedSendMail.mockClear().mockResolvedValue({ messageId: 'test-message-id' });
  mockedCreateTransport.mockReset().mockReturnValue({ sendMail: mockedSendMail });
});

describe('Course Registrations Routes', () => {
  it('GET /api/tiles/:tileId/course-registrations - erfordert Anmeldung', async () => {
    const tileId = createTile();
    const res = await request(app).get(`/api/tiles/${tileId}/course-registrations`);
    expect(res.status).toBe(401);
  });

  it('POST - erfordert tiles:write, auch für einen sonst angemeldeten Nutzer', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['members:manage']);
    const res = await request(app)
      .post(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send(validRegistration);
    expect(res.status).toBe(403);
  });

  it('erstellt, listet, aktualisiert und löscht eine Kurs-Anmeldung mit tiles:write', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);

    const createRes = await request(app)
      .post(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send(validRegistration);
    expect(createRes.status).toBe(201);
    expect(createRes.body.isMember).toBe(false);
    expect(createRes.body.sportType).toBe('Ski Alpin');
    expect(createRes.body.paid).toBe(false);
    expect(createRes.body.enteredBy).toContain('@test.com');
    // New status-tracking fields default to false on create.
    expect(createRes.body.transferredToExternalList).toBe(false);
    expect(createRes.body.confirmationMailSent).toBe(false);
    const id = createRes.body.id as string;

    const listRes = await request(app)
      .get(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].firstName).toBe('Lisa');

    const updateRes = await request(app)
      .put(`/api/course-registrations/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, status: 'cancelled', paid: true, transferredToExternalList: true, confirmationMailSent: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('cancelled');
    expect(updateRes.body.paid).toBe(true);
    // entered_by is set once at creation and never overwritten by later updates
    expect(updateRes.body.enteredBy).toBe(createRes.body.enteredBy);
    // transferredToExternalList IS settable via PUT (admin accounting field)...
    expect(updateRes.body.transferredToExternalList).toBe(true);
    // ...but confirmationMailSent is silently ignored - server-only field.
    expect(updateRes.body.confirmationMailSent).toBe(false);

    const deleteRes = await request(app)
      .delete(`/api/course-registrations/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const listAfter = await request(app)
      .get(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`);
    expect(listAfter.body).toHaveLength(0);
  });

  it('lehnt eine Anmeldung ohne Vor-/Nachname mit 400 ab', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);
    const res = await request(app)
      .post(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, firstName: '', lastName: '' });
    expect(res.status).toBe(400);
  });

  it('gleicht per E-Mail automatisch mit der Mitgliederliste ab', async () => {
    const tileId = createTile();
    const token = createAuthedUser(['tiles:write']);

    const memberId = randomUUID();
    db.prepare(
      "INSERT INTO members (id, first_name, last_name, email, status, source) VALUES (?, 'Lisa', 'Berger', 'lisa@test.com', 'active', 'manual')",
    ).run(memberId);

    const createRes = await request(app)
      .post(`/api/tiles/${tileId}/course-registrations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRegistration, email: 'lisa@test.com' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.isMember).toBe(true);
    expect(createRes.body.memberId).toBe(memberId);
  });

  describe('POST /api/tiles/:tileId/course-registrations/public', () => {
    it('ist öffentlich (keine Anmeldung nötig) und bestätigt sofort', async () => {
      const tileId = createTile();
      const res = await request(app)
        .post(`/api/tiles/${tileId}/course-registrations/public`)
        .send({ firstName: 'Max', lastName: 'Mustermann', email: 'max@test.com', sportType: 'Ski Alpin' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('confirmed');
      expect(res.body.source).toBe('sheet-import');
      // No admin authored a public self-registration.
      expect(res.body.enteredBy).toBeUndefined();
      expect(res.body.paid).toBe(false);
      expect(res.body.transferredToExternalList).toBe(false);

      const list = await request(app)
        .get(`/api/tiles/${tileId}/course-registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body).toHaveLength(1);
    });

    it('verschickt genau eine Bestätigungsmail und markiert confirmationMailSent', async () => {
      const tileId = createTile();
      const res = await request(app)
        .post(`/api/tiles/${tileId}/course-registrations/public`)
        .send({ firstName: 'Max', lastName: 'Mustermann', email: 'max@test.com', sportType: 'Ski Alpin' });

      expect(res.status).toBe(201);
      expect(res.body.confirmationMailSent).toBe(true);
      expect(mockedSendMail).toHaveBeenCalledTimes(1);
      const sentMail = mockedSendMail.mock.calls[0][0] as any;
      expect(sentMail.to).toBe('max@test.com');
      expect(sentMail.subject).toContain('Ski Alpin');
      // Global BCC fallback (no NotificationBccSetting configured in this test).
      expect(sentMail.bcc).toContain('registration@skiclub-kapfenburg.de');

      const list = await request(app)
        .get(`/api/tiles/${tileId}/course-registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body[0].confirmationMailSent).toBe(true);
    });

    it('bleibt trotz fehlgeschlagenem Mailversand gespeichert (Best-Effort, kein Rollback, kein 500)', async () => {
      mockedSendMail.mockRejectedValue(new Error('SMTP down'));

      const tileId = createTile();
      const res = await request(app)
        .post(`/api/tiles/${tileId}/course-registrations/public`)
        .send({ firstName: 'Max', lastName: 'Mustermann', email: 'max@test.com', sportType: 'Ski Alpin' });

      expect(res.status).toBe(201);
      expect(res.body.confirmationMailSent).toBe(false);

      const list = await request(app)
        .get(`/api/tiles/${tileId}/course-registrations`)
        .set('Authorization', `Bearer ${createAuthedUser(['tiles:write'])}`);
      expect(list.body).toHaveLength(1);
      expect(list.body[0].confirmationMailSent).toBe(false);
    });

    it('lehnt eine Anmeldung ohne Vor-/Nachname mit 400 ab', async () => {
      const tileId = createTile();
      const res = await request(app).post(`/api/tiles/${tileId}/course-registrations/public`).send({});
      expect(res.status).toBe(400);
    });

    it('liefert 404 für einen unbekannten Kurs', async () => {
      const res = await request(app)
        .post(`/api/tiles/${randomUUID()}/course-registrations/public`)
        .send({ firstName: 'Max', lastName: 'Mustermann' });
      expect(res.status).toBe(404);
    });

    it('lehnt eine Anmeldung für einen abgesagten Kurs mit 400 ab', async () => {
      const tileId = createTile();
      db.prepare("UPDATE tiles SET status = 'canceled' WHERE id = ?").run(tileId);
      const res = await request(app)
        .post(`/api/tiles/${tileId}/course-registrations/public`)
        .send({ firstName: 'Max', lastName: 'Mustermann' });
      expect(res.status).toBe(400);
    });
  });

  describe('Kursgruppen', () => {
    it('erstellt, listet, aktualisiert und löscht eine Kursgruppe mit tiles:write', async () => {
      const tileId = createTile();
      const token = createAuthedUser(['tiles:write']);

      const createRes = await request(app)
        .post(`/api/tiles/${tileId}/course-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Gruppe A', instructorName: 'Max Trainer' });
      expect(createRes.status).toBe(201);
      const id = createRes.body.id as string;

      const listRes = await request(app)
        .get(`/api/tiles/${tileId}/course-groups`)
        .set('Authorization', `Bearer ${token}`);
      expect(listRes.body).toHaveLength(1);
      expect(listRes.body[0].instructorName).toBe('Max Trainer');

      const updateRes = await request(app)
        .put(`/api/course-groups/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Gruppe A (umbenannt)', instructorName: 'Anna Coach' });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.name).toBe('Gruppe A (umbenannt)');

      const deleteRes = await request(app)
        .delete(`/api/course-groups/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(deleteRes.status).toBe(204);
    });

    it('lehnt eine Gruppe ohne Namen mit 400 ab', async () => {
      const tileId = createTile();
      const token = createAuthedUser(['tiles:write']);
      const res = await request(app)
        .post(`/api/tiles/${tileId}/course-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });
      expect(res.status).toBe(400);
    });

    it('setzt group_id einer Anmeldung auf NULL, wenn die Gruppe gelöscht wird', async () => {
      const tileId = createTile();
      const token = createAuthedUser(['tiles:write']);

      const groupRes = await request(app)
        .post(`/api/tiles/${tileId}/course-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Gruppe A' });
      const groupId = groupRes.body.id as string;

      const regRes = await request(app)
        .post(`/api/tiles/${tileId}/course-registrations`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validRegistration, groupId });
      expect(regRes.body.groupId).toBe(groupId);

      await request(app).delete(`/api/course-groups/${groupId}`).set('Authorization', `Bearer ${token}`);

      const listRes = await request(app)
        .get(`/api/tiles/${tileId}/course-registrations`)
        .set('Authorization', `Bearer ${token}`);
      expect(listRes.body[0].groupId).toBeUndefined();
    });
  });
});
