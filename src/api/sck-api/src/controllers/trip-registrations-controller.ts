/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { TripRegistrationCreationParams } from '../domain/trip-registration.js';
import * as registrationsService from '../services/trip-registrations-service.js';

const isValidParams = (body: TripRegistrationCreationParams): boolean =>
  !!body.firstName?.trim() && !!body.lastName?.trim();

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
