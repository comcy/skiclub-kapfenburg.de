import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { createRegistration, getRegistration, updateRegistration } from '../services/trip-registrations-service.js';

const params = (firstName: string, lastName: string, email: string, isMember: boolean) => ({
  firstName,
  lastName,
  email,
  ageCategory: 'adult' as const,
  isMember,
  status: 'confirmed' as const,
  source: 'manual' as const,
  orderIndex: 0,
  transferredToExternalList: false,
  busOnly: false,
  snowshoes: false,
  courseRequested: false,
});

describe('Mitglied-Flag und Verknüpfung bleiben konsistent', () => {
  it('Verknüpfung mit der Mitgliederliste bedeutet Mitglied (auch bei alter Markierung) und wird beim Speichern übernommen', () => {
    const memberId = randomUUID();
    db.prepare('INSERT INTO members (id, first_name, last_name, email) VALUES (?, ?, ?, ?)').run(memberId, 'Mia', 'Flag', 'mia@flag.de');
    const tileId = randomUUID();
    db.prepare("INSERT INTO tiles (id, type, title) VALUES (?, 'event', 'Flag')").run(tileId);

    const created = createRegistration(tileId, params('Mia', 'Flag', 'mia@flag.de', false), 'admin');
    expect(created).toMatchObject({ memberId, isMember: true });

    // Altbestand: verknüpft, aber Markierung noch 0
    db.prepare('UPDATE trip_registrations SET is_member = 0 WHERE id = ?').run(created.id);
    expect(getRegistration(created.id)?.isMember).toBe(true);

    // Editor sendet isMember=false (Checkbox war leer) -> bleibt Mitglied, solange verknüpft
    const updated = updateRegistration(created.id, params('Mia', 'Flag', 'mia@flag.de', false));
    expect(updated?.isMember).toBe(true);
    expect((db.prepare('SELECT is_member AS m FROM trip_registrations WHERE id = ?').get(created.id) as any).m).toBe(1);
  });
});
