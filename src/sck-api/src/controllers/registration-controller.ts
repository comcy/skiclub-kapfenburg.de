/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from 'express';
import { saveEntity, getEntities, getEntityById } from '../services/data-service.js';
import { TripRegisterFormValue, SheetDbRow } from '../domain/registration.js';

const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const createRegistration: RequestHandler = async (req, res) => {
    try {
        const registrationData = req.body as TripRegisterFormValue;
        const { trip, additionalText, participants } = registrationData;

        if (!trip || !participants || !Array.isArray(participants) || participants.length === 0) {
            res.status(400).json({ error: 'Die Reise und mindestens ein Teilnehmer sind erforderlich.' });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { availableBoardings, ...tripWithoutBoardings } = trip;

        const sheetDbRows: SheetDbRow[] = participants.map((participant) => {
            return {
                ...tripWithoutBoardings,
                ...participant,
                age: calculateAge(participant.birthday),
                additionalText: additionalText,
            };
        });

        const savedRecords = [];
        for (const row of sheetDbRows) {
            const savedRecord = await saveEntity('registrations', { ...row, type: 'trip-registration' });
            savedRecords.push(savedRecord);
        }

        res.status(201).json({ message: 'Registrierung erfolgreich gespeichert.', data: savedRecords });
    } catch (error: any) {
        console.error('Fehler bei der Erstellung der Registrierung:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getAllRegistrations: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const registrations = await getEntities('registrations', page, limit);
        res.status(200).json(registrations);
    } catch (error: any) {
        console.error('Fehler beim Abrufen der Registrierungen:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getRegistrationById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await getEntityById('registrations', id);
        if (registration) {
            res.status(200).json(registration);
        } else {
            res.status(404).json({ message: 'Registrierung nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler beim Abrufen der Registrierung:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};
