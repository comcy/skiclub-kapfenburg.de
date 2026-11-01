/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { MemberCreationParams } from '../domain/member.js';
import * as membersService from '../services/members-service.js';

const isValidMember = (body: Partial<MemberCreationParams>): boolean =>
  !!body.firstName?.trim() &&
  !!body.lastName?.trim() &&
  (body.additionalEmails === undefined ||
    (Array.isArray(body.additionalEmails) && body.additionalEmails.every((e) => typeof e === 'string')));

export const listMembers: RequestHandler = (req, res) => {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
    const limit = parseInt(String(req.query.limit ?? '100'), 10) || 100;
    res.status(200).json(membersService.listMembers(page, limit));
  } catch (error: any) {
    console.error('Fehler beim Laden der Mitglieder:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mitglieder.', details: error.message });
  }
};

// Nur Namen der Lehrteam-Mitglieder (Auswahl der Verantwortlichen im Tile-Editor).
export const listTeachingTeam: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(membersService.listTeachingTeamBrief());
  } catch (error: any) {
    console.error('Fehler beim Laden des Lehrteams:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Lehrteams.' });
  }
};

export const getMember: RequestHandler = (req, res) => {
  try {
    const member = membersService.getMember(String(req.params.id));
    if (!member) {
      res.status(404).json({ error: 'Mitglied nicht gefunden.' });
      return;
    }
    res.status(200).json(member);
  } catch (error: any) {
    console.error('Fehler beim Laden des Mitglieds:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Mitglieds.', details: error.message });
  }
};

export const createMember: RequestHandler = (req, res) => {
  try {
    const body = req.body as MemberCreationParams;
    if (!isValidMember(body)) {
      res.status(400).json({ error: 'Vorname und Nachname sind erforderlich.' });
      return;
    }
    const member = membersService.createMember(body);
    // Online-Antrag mit Familie: alle genannten Personen als eigene Mitglieder derselben Familiengruppe anlegen.
    membersService.createFamilyMembersFromApplication(member);
    if (body.familyReferentId) membersService.linkToFamily(member.id, body.familyReferentId);
    res.status(201).json(membersService.getMember(member.id));
  } catch (error: any) {
    console.error('Fehler beim Anlegen des Mitglieds:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen des Mitglieds.', details: error.message });
  }
};

export const updateMember: RequestHandler = (req, res) => {
  try {
    const body = req.body as MemberCreationParams;
    if (!isValidMember(body)) {
      res.status(400).json({ error: 'Vorname und Nachname sind erforderlich.' });
      return;
    }
    const member = membersService.updateMember(String(req.params.id), body);
    if (!member) {
      res.status(404).json({ error: 'Mitglied nicht gefunden.' });
      return;
    }
    if (body.familyReferentId) membersService.linkToFamily(member.id, body.familyReferentId);
    res.status(200).json(membersService.getMember(member.id));
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren des Mitglieds:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Mitglieds.', details: error.message });
  }
};

export const deleteMember: RequestHandler = (req, res) => {
  try {
    const deleted = membersService.deleteMember(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Mitglied nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des Mitglieds:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Mitglieds.', details: error.message });
  }
};

export const getAnniversaries: RequestHandler = (req, res) => {
  try {
    const date = String(req.query.date ?? '');
    const years = String(req.query.years ?? '')
      .split(',')
      .map((value) => parseInt(value.trim(), 10))
      .filter((value) => !isNaN(value) && value > 0);

    if (!date || years.length === 0) {
      res.status(400).json({ error: 'date und years sind erforderlich.' });
      return;
    }

    res.status(200).json(membersService.getAnniversaries(date, years));
  } catch (error: any) {
    console.error('Fehler beim Laden der Jubiläen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Jubiläen.', details: error.message });
  }
};

export const markHonored: RequestHandler = (req, res) => {
  try {
    const years = parseInt(String(req.body?.years ?? ''), 10);
    if (isNaN(years) || years <= 0) {
      res.status(400).json({ error: 'years ist erforderlich.' });
      return;
    }
    const member = membersService.markHonored(String(req.params.id), years);
    if (!member) {
      res.status(404).json({ error: 'Mitglied nicht gefunden.' });
      return;
    }
    res.status(200).json(member);
  } catch (error: any) {
    console.error('Fehler beim Markieren als geehrt:', error);
    res.status(500).json({ error: 'Fehler beim Markieren als geehrt.', details: error.message });
  }
};

export const listMembershipApplications: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(membersService.listMembershipApplications());
  } catch (error: any) {
    console.error('Fehler beim Laden der Mitgliedsanträge:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mitgliedsanträge.', details: error.message });
  }
};

// Klartext-IBAN eines Antrags - bewusst eigener Abruf statt Teil der Antragsliste, damit sie
// nur auf ausdruecklichen Klick (members:manage) die Platte verlaesst. Zugriff wird
// protokolliert (ohne die IBAN selbst).
export const getApplicationIban: RequestHandler = (req, res) => {
  const registrationId = String(req.params.registrationId);
  try {
    const iban = membersService.getApplicationIban(registrationId);
    if (!iban) {
      res.status(404).json({ error: 'Zu diesem Antrag wurde keine IBAN gespeichert.' });
      return;
    }
    console.log(`IBAN von Antrag ${registrationId} abgerufen von ${req.user?.email ?? 'unbekannt'}.`);
    res.status(200).json({ iban });
  } catch (error: any) {
    console.error('Fehler beim Entschlüsseln der Antrags-IBAN:', error?.message);
    res.status(500).json({ error: 'Die IBAN konnte nicht entschlüsselt werden (passt der SEPA_ENCRYPTION_KEY?).' });
  }
};
