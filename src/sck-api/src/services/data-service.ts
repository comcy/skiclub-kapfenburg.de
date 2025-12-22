/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'registrations.ndjson');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Speichert ein Datenobjekt in der NDJSON-Datei.
 * @param type Der Typ des Datensatzes (z.B. 'email-contact', 'course-registration').
 * @param data Das zu speichernde Objekt.
 * @returns Das gespeicherte Objekt mit einer generierten ID.
 */
export const saveData = async (type: string, data: object): Promise<any> => {
    const record = {
        id: randomUUID(),
        type,
        timestamp: new Date().toISOString(),
        ...data,
    };

    const line = JSON.stringify(record) + '\n';

    try {
        await fs.promises.appendFile(dataFile, line);
        return record;
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        throw new Error('Daten konnten nicht gespeichert werden.');
    }
};

/**
 * Liest alle Registrierungen aus der NDJSON-Datei.
 * @returns Eine Liste aller Registrierungen.
 */
export const getRegistrations = async (): Promise<any[]> => {
    try {
        const data = await fs.promises.readFile(dataFile, 'utf-8');
        const lines = data.split('\n').filter((line) => line.length > 0);
        return lines.map((line) => JSON.parse(line));
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return []; // Datei nicht gefunden, leere Liste zurückgeben
        }
        console.error('Fehler beim Lesen der Daten:', error);
        throw new Error('Daten konnten nicht gelesen werden.');
    }
};

/**
 * Liest eine einzelne Registrierung anhand ihrer ID.
 * @param id Die ID der zu suchenden Registrierung.
 * @returns Die gefundene Registrierung oder null.
 */
export const getRegistrationById = async (id: string): Promise<any | null> => {
    const registrations = await getRegistrations();
    return registrations.find((reg) => reg.id === id) || null;
};
