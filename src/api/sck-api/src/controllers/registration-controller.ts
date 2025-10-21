/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from 'express';
import { saveData } from '../services/data-service.js';
import { RegistrationRequestBody } from '../domain/registration.js';

export const createRegistration: RequestHandler = async (req, res) => {
  try {
    const registrationData = req.body as RegistrationRequestBody;

    if (!registrationData.firstName || !registrationData.lastName || !registrationData.email) {
      res.status(400).json({ error: 'Vorname, Nachname und E-Mail sind erforderlich.' });
      return;
    }

    await saveData('course-registration', registrationData);

    res.status(201).json({ message: 'Registrierung erfolgreich gespeichert.', data: registrationData });

  } catch (error: any) {
    console.error('Fehler bei der Erstellung der Registrierung:', error);
    res.status(500).json({
      error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
      details: error.message,
    });
  }
};
