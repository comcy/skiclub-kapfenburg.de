/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { createVerifiedPerson, listVerifiedPersons, resolveMember, revokeVerifiedPerson } from '../services/member-match-service.js';
import { getMember } from '../services/members-service.js';

export const listVerifiedPersonsHandler: RequestHandler = (_req, res) => {
  res.status(200).json(listVerifiedPersons());
};

export const createVerifiedPersonHandler: RequestHandler = (req, res) => {
  const { firstName, lastName, birthday, memberId } = req.body ?? {};
  if (typeof firstName !== 'string' || !firstName.trim() || typeof lastName !== 'string' || !lastName.trim()) {
    res.status(400).json({ error: 'Vor- und Nachname sind erforderlich.' });
    return;
  }
  if (birthday !== undefined && (typeof birthday !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthday))) {
    res.status(400).json({ error: 'Geburtsdatum muss JJJJ-MM-TT sein.' });
    return;
  }
  if (memberId !== undefined && (typeof memberId !== 'string' || !getMember(memberId))) {
    res.status(400).json({ error: 'Mitglied nicht gefunden.' });
    return;
  }
  res.status(201).json(createVerifiedPerson({ firstName, lastName, birthday, memberId }, req.user!.id));
};

export const revokeVerifiedPersonHandler: RequestHandler = (req, res) => {
  const person = revokeVerifiedPerson(String(req.params.id));
  if (!person) {
    res.status(404).json({ error: 'Verifizierte Person nicht gefunden oder bereits widerrufen.' });
    return;
  }
  res.status(200).json(person);
};

// Vorschau für Listen-Import: je Person, ob sie (wie bei der Anlage durch einen Admin) als Mitglied erkannt würde.
export const matchVerifiedPersonsHandler: RequestHandler = (req, res) => {
  const people = Array.isArray(req.body?.people) ? req.body.people.slice(0, 500) : null;
  if (!people) {
    res.status(400).json({ error: 'people (Liste) ist erforderlich.' });
    return;
  }
  res.status(200).json(
    people.map((p: any) => resolveMember({ firstName: String(p?.firstName ?? ''), lastName: String(p?.lastName ?? ''), birthday: p?.birthday, email: p?.email }, true).isMember === 1),
  );
};
