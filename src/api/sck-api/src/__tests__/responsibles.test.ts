import { randomUUID } from 'node:crypto';

process.env.SEPA_ENCRYPTION_KEY = '1'.repeat(64);

const { db } = await import('../db/connection.js');
const { getResponsibleEmails, listTeachingTeamBrief } = await import('../services/members-service.js');
const { getTripConfirmationMailBcc } = await import('../services/trip-registration-mail-service.js');
const { getCourseConfirmationMailBcc } = await import('../services/course-registration-mail-service.js');

const addMember = (firstName: string, email: string | null, team: number, status = 'active'): string => {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO members (id, first_name, last_name, email, status, source, is_family_membership, is_teaching_team)
     VALUES (?, ?, 'T', ?, ?, 'manual', 0, ?)`,
  ).run(id, firstName, email, status, team);
  return id;
};

beforeEach(() => {
  db.exec('DELETE FROM members; DELETE FROM settings;');
});

describe('Verantwortliche (Lehrteam)', () => {
  it('liefert nur aktive Lehrteam-Mitglieder mit E-Mail', () => {
    const a = addMember('A', 'a@test.com', 1);
    const b = addMember('B', 'b@test.com', 0); // nicht (mehr) im Lehrteam
    const c = addMember('C', null, 1); // ohne E-Mail
    const d = addMember('D', 'd@test.com', 1, 'inactive');
    expect(getResponsibleEmails({ responsibleMemberIds: [a, b, c, d] })).toEqual(['a@test.com']);
    expect(getResponsibleEmails({})).toEqual([]);
  });

  it('BCC aller Bestätigungsmails enthält Verantwortliche zusätzlich zur Standardliste, ohne Dubletten', () => {
    const a = addMember('A', 'a@test.com', 1);
    const trip = getTripConfirmationMailBcc({ responsibleMemberIds: [a] }).split(',');
    expect(trip).toContain('a@test.com');
    expect(trip).toContain('registration@skiclub-kapfenburg.de');
    expect(getCourseConfirmationMailBcc({ responsibleMemberIds: [a, a] }).split(',').filter((e) => e === 'a@test.com')).toHaveLength(1);
    expect(getTripConfirmationMailBcc()).not.toContain('a@test.com');
  });

  it('listTeachingTeamBrief gibt nur Namen zurück', () => {
    addMember('A', 'a@test.com', 1);
    addMember('B', 'b@test.com', 0);
    expect(listTeachingTeamBrief().map((m) => Object.keys(m).sort())).toEqual([['firstName', 'id', 'lastName']]);
  });
});
