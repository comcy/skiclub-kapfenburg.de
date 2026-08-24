/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import { CourseGroupCreationParams, CourseRegistrationCreationParams } from '../domain/course-registration.js';
import * as registrationsService from '../services/course-registrations-service.js';

const isValidRegistrationParams = (body: CourseRegistrationCreationParams): boolean =>
  !!body.firstName?.trim() && !!body.lastName?.trim();

const isValidGroupParams = (body: CourseGroupCreationParams): boolean => !!body.name?.trim();

export const listCourseRegistrations: RequestHandler = (req, res) => {
  try {
    res.status(200).json(registrationsService.listRegistrationsForTile(String(req.params.tileId)));
  } catch (error: any) {
    console.error('Fehler beim Laden der Kurs-Anmeldungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Kurs-Anmeldungen.' });
  }
};

export const createCourseRegistration: RequestHandler = (req, res) => {
  try {
    const body = req.body as CourseRegistrationCreationParams;
    if (!isValidRegistrationParams(body)) {
      res.status(400).json({ error: 'Vor- und Nachname sind erforderlich.' });
      return;
    }
    res.status(201).json(registrationsService.createRegistration(String(req.params.tileId), body));
  } catch (error: any) {
    console.error('Fehler beim Erstellen der Kurs-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Kurs-Anmeldung.' });
  }
};

export const updateCourseRegistration: RequestHandler = (req, res) => {
  try {
    const body = req.body as CourseRegistrationCreationParams;
    if (!isValidRegistrationParams(body)) {
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
    console.error('Fehler beim Aktualisieren der Kurs-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Kurs-Anmeldung.' });
  }
};

export const deleteCourseRegistration: RequestHandler = (req, res) => {
  try {
    const deleted = registrationsService.deleteRegistration(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Anmeldung nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen der Kurs-Anmeldung:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Kurs-Anmeldung.' });
  }
};

export const listCourseGroups: RequestHandler = (req, res) => {
  try {
    res.status(200).json(registrationsService.listGroupsForTile(String(req.params.tileId)));
  } catch (error: any) {
    console.error('Fehler beim Laden der Kursgruppen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Kursgruppen.' });
  }
};

export const createCourseGroup: RequestHandler = (req, res) => {
  try {
    const body = req.body as CourseGroupCreationParams;
    if (!isValidGroupParams(body)) {
      res.status(400).json({ error: 'Ein Gruppenname ist erforderlich.' });
      return;
    }
    res.status(201).json(registrationsService.createGroup(String(req.params.tileId), body));
  } catch (error: any) {
    console.error('Fehler beim Erstellen der Kursgruppe:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Kursgruppe.' });
  }
};

export const updateCourseGroup: RequestHandler = (req, res) => {
  try {
    const body = req.body as CourseGroupCreationParams;
    if (!isValidGroupParams(body)) {
      res.status(400).json({ error: 'Ein Gruppenname ist erforderlich.' });
      return;
    }
    const group = registrationsService.updateGroup(String(req.params.id), body);
    if (!group) {
      res.status(404).json({ error: 'Kursgruppe nicht gefunden.' });
      return;
    }
    res.status(200).json(group);
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren der Kursgruppe:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Kursgruppe.' });
  }
};

export const deleteCourseGroup: RequestHandler = (req, res) => {
  try {
    const deleted = registrationsService.deleteGroup(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Kursgruppe nicht gefunden.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen der Kursgruppe:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Kursgruppe.' });
  }
};
