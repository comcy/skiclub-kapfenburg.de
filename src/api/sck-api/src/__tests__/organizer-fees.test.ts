import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { setSetting } from '../services/settings-service.js';
import { PARTICIPATION_FEES_SETTING_KEY } from '../domain/settings.js';
import { calculateParticipantPrice } from '../services/trip-pricing-service.js';
import {
  createRegistration,
  getRegistration,
  listRegistrationsForTile,
  syncOrganizerRegistrations,
} from '../services/trip-registrations-service.js';

const pricing = { busLift: { adult: { member: 90, nonMember: 100 }, youthUntil16: { member: 60, nonMember: 70 }, childUntil6: { member: 40, nonMember: 50 } } };
const base = { busOnly: false, snowshoes: false, courseRequested: false, ageCategory: 'adult' as const, isMember: true };

const addMember = (first: string, last: string, teaching = false): string => {
  const id = randomUUID();
  db.prepare('INSERT INTO members (id, first_name, last_name, email, is_teaching_team) VALUES (?, ?, ?, ?, ?)').run(
    id,
    first,
    last,
    `${first}.${last}@test.de`.toLowerCase(),
    teaching ? 1 : 0,
  );
  return id;
};

const addTrip = (responsible: string[], actions = '["register"]'): string => {
  const id = randomUUID();
  db.prepare("INSERT INTO tiles (id, type, title, actions, extra_json) VALUES (?, 'event', 'Ausfahrt', ?, ?)").run(
    id,
    actions,
    JSON.stringify({ responsibleMemberIds: responsible }),
  );
  return id;
};

const params = (firstName: string, lastName: string, email?: string) => ({
  firstName,
  lastName,
  email,
  ageCategory: 'adult' as const,
  isMember: false,
  status: 'confirmed' as const,
  source: 'manual' as const,
  orderIndex: 0,
  transferredToExternalList: false,
  busOnly: false,
  snowshoes: false,
  courseRequested: false,
});

describe('Organisator-/Lehrteam-Beiträge', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM settings WHERE key = ?').run(PARTICIPATION_FEES_SETTING_KEY);
  });

  it('Pauschalen: Standard Organisator 0 €, Lehrteam 50 €, konfigurierbar', () => {
    expect(calculateParticipantPrice({ ...base, role: 'organizer' }, pricing)).toBe(0);
    expect(calculateParticipantPrice({ ...base, role: 'teachingTeam' }, pricing)).toBe(50);
    expect(calculateParticipantPrice(base, pricing)).toBe(90);
    setSetting(PARTICIPATION_FEES_SETTING_KEY, { organizer: 10, teachingTeam: 35 });
    expect(calculateParticipantPrice({ ...base, role: 'organizer' }, pricing)).toBe(10);
    expect(calculateParticipantPrice({ ...base, role: 'teachingTeam' }, pricing)).toBe(35);
  });

  it('Organisatoren werden automatisch angemeldet (einmalig, nur Ausfahrten) und erhalten die Rolle', () => {
    const organizer = addMember('Olga', 'Orga', true);
    const trip = addTrip([organizer]);
    syncOrganizerRegistrations(trip);
    syncOrganizerRegistrations(trip); // idempotent
    const list = listRegistrationsForTile(trip);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ firstName: 'Olga', participantRole: 'organizer', status: 'confirmed', isMember: true });

    const info = addTrip([organizer], '[]');
    syncOrganizerRegistrations(info);
    expect(listRegistrationsForTile(info)).toHaveLength(0);
  });

  it('bereits angemeldeter Organisator wird nicht doppelt angelegt; Lehrteam ohne Organisator-Rolle -> teachingTeam', () => {
    const organizer = addMember('Ora', 'Schon');
    const teacher = addMember('Tina', 'Lehr', true);
    const trip = addTrip([organizer]);
    createRegistration(trip, params('Ora', 'Schon'), 'admin');
    createRegistration(trip, params('Tina', 'Lehr', 'tina.lehr@test.de'), 'admin');
    syncOrganizerRegistrations(trip);
    const list = listRegistrationsForTile(trip);
    expect(list).toHaveLength(2);
    expect(list.find((r) => r.firstName === 'Ora')?.participantRole).toBe('organizer');
    expect(getRegistration(list.find((r) => r.firstName === 'Tina')!.id)?.participantRole).toBe('teachingTeam');
    expect(teacher).toBeTruthy();
  });
});
