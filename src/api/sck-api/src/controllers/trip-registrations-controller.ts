/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { PublicParticipantInput, TripRegistrationCreationParams } from '../domain/trip-registration.js';
import * as registrationsService from '../services/trip-registrations-service.js';
import { getTile } from '../services/tiles-service.js';

const isValidParams = (body: TripRegistrationCreationParams): boolean =>
  !!body.firstName?.trim() && !!body.lastName?.trim();

const isValidParticipant = (participant: unknown): participant is PublicParticipantInput => {
  if (!participant || typeof participant !== 'object') return false;
  const p = participant as Record<string, unknown>;
  return typeof p.firstName === 'string' && p.firstName.trim().length > 0 && typeof p.lastName === 'string' && p.lastName.trim().length > 0;
};

export const listTripRegistrations: RequestHandler = (req, res) => {
  try {
    res.status(200).json(registrationsService.listRegistrationsForTile(String(req.params.tileId)));
  } catch (error: any) {
    console.error('Fehler beim Laden der Anmeldungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Anmeldungen.', details: error.message });
  }
};

export const createTripRegistration: RequestHandler = (req, res) => {
  try {
    const body = req.body as TripRegistrationCreationParams;
    if (!isValidParams(body)) {
      res.status(400).json({ error: 'Vor- und Nachname sind erforderlich.' });
      return;
    }
    res.status(201).json(registrationsService.createRegistration(String(req.params.tileId), body));
  } catch (error: any) {
    console.error('Fehler beim Erstellen der Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Anmeldung.', details: error.message });
  }
};

// Public - the website's Ausfahrten registration form calls this in
// parallel with its existing Google-Sheet submission (see the plan), no
// auth. Mirrors registration-route.ts's precedent: inline validation, then
// a plain try/catch (an invalid tileId trips the tile_registrations FK
// constraint and falls through to the 500 branch below).
export const createPublicTripRegistrations: RequestHandler = (req, res) => {
  try {
    const tileId = String(req.params.tileId);
    if (!getTile(tileId)) {
      res.status(404).json({ error: 'Ausfahrt nicht gefunden.' });
      return;
    }

    const participants = req.body?.participants;
    if (!Array.isArray(participants) || participants.length === 0 || !participants.every(isValidParticipant)) {
      res.status(400).json({ error: 'Mindestens ein Teilnehmer mit Vor- und Nachname ist erforderlich.' });
      return;
    }

    res.status(201).json(registrationsService.createPublicRegistrations(tileId, participants));
  } catch (error: any) {
    console.error('Fehler beim Speichern der öffentlichen Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Anmeldung.', details: error.message });
  }
};

export const updateTripRegistration: RequestHandler = (req, res) => {
  try {
    const body = req.body as TripRegistrationCreationParams;
    if (!isValidParams(body)) {
      res.status(400).json({ error: 'Vor- und Nachname sind erforderlich.' });
      return;
    }
    const registration = registrationsService.updateRegistration(String(req.params.id), body);
    if (!registration) {
      res.status(404).json({ error: 'Anmeldung nicht gefunden.' });
      return;
    }
    res.status(200).json(registration);
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren der Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Anmeldung.', details: error.message });
  }
};

export const deleteTripRegistration: RequestHandler = (req, res) => {
  try {
    const deleted = registrationsService.deleteRegistration(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Anmeldung nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen der Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Anmeldung.', details: error.message });
  }
};
