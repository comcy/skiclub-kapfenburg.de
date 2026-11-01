import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import {
  createVerifiedPerson,
  resolveMember,
  revokeVerifiedPerson,
} from '../services/member-match-service.js';

const addMember = (firstName: string, lastName: string, extra: { email?: string; birthday?: string } = {}): string => {
  const id = randomUUID();
  db.prepare('INSERT INTO members (id, first_name, last_name, email, birthday) VALUES (?, ?, ?, ?, ?)').run(
    id,
    firstName,
    lastName,
    extra.email ?? null,
    extra.birthday ?? null,
  );
  return id;
};

describe('resolveMember', () => {
  it('matcht per E-Mail (case-insensitiv)', () => {
    const id = addMember('Anna', 'Mail', { email: 'anna.match@test.de' });
    expect(resolveMember({ email: 'ANNA.MATCH@test.de', firstName: 'X', lastName: 'Y' }, false)).toEqual({ id, isMember: 1 });
  });

  it('matcht Name + Geburtsdatum, auch öffentlich', () => {
    const id = addMember('Berta', 'Geburt', { birthday: '1980-05-05' });
    const input = { firstName: 'berta', lastName: 'GEBURT', birthday: '1980-05-05' };
    expect(resolveMember(input, false)).toEqual({ id, isMember: 1 });
  });

  it('abweichendes Geburtsdatum schließt Namens-Match aus', () => {
    addMember('Carla', 'Datum', { birthday: '1970-01-01' });
    expect(resolveMember({ firstName: 'Carla', lastName: 'Datum', birthday: '1999-09-09' }, true).isMember).toBe(0);
  });

  it('Name allein nur für Admin und nur eindeutig', () => {
    const id = addMember('Dora', 'Nurname');
    const input = { firstName: 'Dora', lastName: 'Nurname' };
    expect(resolveMember(input, false).isMember).toBe(0);
    expect(resolveMember(input, true)).toEqual({ id, isMember: 1 });
    addMember('Dora', 'Nurname');
    expect(resolveMember(input, true).isMember).toBe(0);
  });

  it('verifizierte Person (ohne Mitglied) matcht; Widerruf hebt auf', () => {
    const person = createVerifiedPerson({ firstName: 'Emil', lastName: 'Kind', birthday: '2015-03-03' });
    const input = { firstName: 'Emil', lastName: 'Kind', birthday: '2015-03-03' };
    expect(resolveMember(input, false)).toEqual({ id: null, isMember: 1 });
    revokeVerifiedPerson(person.id);
    expect(resolveMember(input, false).isMember).toBe(0);
  });

  it('verifizierte Person verknüpft mit Mitglied zählt nicht doppelt', () => {
    const memberId = addMember('Frank', 'Doppel');
    createVerifiedPerson({ firstName: 'Frank', lastName: 'Doppel', memberId });
    expect(resolveMember({ firstName: 'Frank', lastName: 'Doppel' }, true)).toEqual({ id: memberId, isMember: 1 });
  });
});
