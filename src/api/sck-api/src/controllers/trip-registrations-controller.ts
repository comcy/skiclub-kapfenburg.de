/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { TileStatus } from '../domain/tile.js';
import { PublicParticipantInput, TripRegistrationCreationParams } from '../domain/trip-registration.js';
import * as registrationsService from '../services/trip-registrations-service.js';
import { getTile } from '../services/tiles-service.js';
import { sendMail } from '../services/mailer.js';
import {
  getTripConfirmationMailBcc,
  getTripConfirmationMailSubject,
  getTripConfirmationMailText,
} from '../services/trip-registration-mail-service.js';
import { calculateParticipantPrice, getCurrentTripPricing } from '../services/trip-pricing-service.js';

const isValidParams = (body: TripRegistrationCreationParams): boolean =>
  !!body.firstName?.trim() && !!body.lastName?.trim();

// Caps a single public submission (contact person + any additional
// participants, e.g. a family) - an unbounded array would let one request
// enqueue arbitrary numbers of DB inserts and pollute a tile's waitlist.
const MAX_PARTICIPANTS_PER_REQUEST = 20;

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
    res.status(500).json({ error: 'Fehler beim Laden der Anmeldungen.' });
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
    res.status(500).json({ error: 'Fehler beim Erstellen der Anmeldung.' });
  }
};

// Public - the website's Ausfahrten registration form calls this in
// parallel with its existing Google-Sheet submission (see the plan), no
// auth. Mirrors registration-route.ts's precedent: inline validation, then
// a plain try/catch (an invalid tileId trips the tile_registrations FK
// constraint and falls through to the 500 branch below).
// Bestätigungsmail wird server-seitig verschickt (verlässlicher als der
// frühere client-seitige Parallel-Request, siehe die Plan-Begründung) -
// Speichern zuerst, Mailversand danach best-effort, analog zu
// membership-controller.ts's createMembershipRegistration. Genau EINE Mail
// pro Gesamt-Anmeldung (nicht pro Teilnehmer), an den Ansprechpartner.
export const createPublicTripRegistrations: RequestHandler = async (req, res) => {
  try {
    const tileId = String(req.params.tileId);
    const tile = getTile(tileId);
    if (!tile) {
      res.status(404).json({ error: 'Ausfahrt nicht gefunden.' });
      return;
    }
    if (tile.status === TileStatus.Canceled || tile.expired) {
      res.status(400).json({ error: 'Für diese Ausfahrt ist keine Anmeldung mehr möglich.' });
      return;
    }

    const participants = req.body?.participants;
    if (!Array.isArray(participants) || participants.length === 0 || !participants.every(isValidParticipant)) {
      res.status(400).json({ error: 'Mindestens ein Teilnehmer mit Vor- und Nachname ist erforderlich.' });
      return;
    }
    if (participants.length > MAX_PARTICIPANTS_PER_REQUEST) {
      res.status(400).json({ error: `Höchstens ${MAX_PARTICIPANTS_PER_REQUEST} Teilnehmer pro Anmeldung.` });
      return;
    }

    const { registrationIds, ...publicResult } = registrationsService.createPublicRegistrations(tileId, participants);

    const createdRegistrations = registrationIds
      .map((id) => registrationsService.getRegistration(id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);
    const [contactPerson] = createdRegistrations;

    if (contactPerson) {
      try {
        await sendMail(
          contactPerson.email ?? '',
          getTripConfirmationMailSubject(contactPerson.firstName, publicResult.status),
          getTripConfirmationMailText(tile, contactPerson, createdRegistrations, publicResult),
          getTripConfirmationMailBcc(),
        );
        registrationsService.markConfirmationMailSent(registrationIds);
      } catch (mailError) {
        console.error('Fehler beim Versand der Ausfahrten-Bestätigungsmail:', mailError);
      }
    }

    res.status(201).json(publicResult);
  } catch (error: any) {
    console.error('Fehler beim Speichern der öffentlichen Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Anmeldung.' });
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
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Anmeldung.' });
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
    res.status(500).json({ error: 'Fehler beim Löschen der Anmeldung.' });
  }
};

interface PricePreviewParticipant {
  birthday?: string;
  isMember?: boolean;
  busOnly?: boolean;
  snowshoes?: boolean;
  courseRequested?: boolean;
  level?: string;
}

const isValidPricePreviewParticipant = (participant: unknown): participant is PricePreviewParticipant =>
  !!participant && typeof participant === 'object';

// Public, read-only price computation - the website's registration form
// calls this for its live price preview instead of duplicating
// calculateParticipantPrice a third time (see the plan). No DB writes, so
// no Turnstile gate (unlike the actual registration POST above).
export const getTripPricePreview: RequestHandler = (req, res) => {
  try {
    const participants = req.body?.participants;
    if (!Array.isArray(participants) || participants.length === 0 || !participants.every(isValidPricePreviewParticipant)) {
      res.status(400).json({ error: 'Mindestens ein Teilnehmer ist erforderlich.' });
      return;
    }
    if (participants.length > MAX_PARTICIPANTS_PER_REQUEST) {
      res.status(400).json({ error: `Höchstens ${MAX_PARTICIPANTS_PER_REQUEST} Teilnehmer pro Anfrage.` });
      return;
    }

    const pricing = getCurrentTripPricing();
    const prices = (participants as PricePreviewParticipant[]).map((participant) =>
      calculateParticipantPrice(
        {
          busOnly: participant.busOnly ?? false,
          snowshoes: participant.snowshoes ?? false,
          courseRequested: participant.courseRequested ?? false,
          level: participant.level,
          ageCategory: registrationsService.resolveAgeCategory(participant.birthday),
          isMember: participant.isMember ?? false,
        },
        pricing,
      ),
    );

    res.status(200).json({ prices, total: prices.reduce((sum, price) => sum + price, 0) });
  } catch (error: any) {
    console.error('Fehler bei der Preisvorschau:', error);
    res.status(500).json({ error: 'Fehler bei der Preisberechnung.' });
  }
};
