/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { MemberCreationParams } from '../domain/member.js';
import * as membersService from '../services/members-service.js';

const isValidMember = (body: Partial<MemberCreationParams>): boolean =>
  !!body.firstName?.trim() && !!body.lastName?.trim();

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
    res.status(201).json(membersService.createMember(body));
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
    res.status(200).json(member);
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

export const listMembershipApplications: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(membersService.listMembershipApplications());
  } catch (error: any) {
    console.error('Fehler beim Laden der Mitgliedsanträge:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mitgliedsanträge.', details: error.message });
  }
};
