/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'registrations.ndjson');
// Bewusst eine eigene Datei/"Tabelle", getrennt von registrations.ndjson:
// SEPA/IBAN-Daten dürfen nicht zusammen mit den übrigen Antragsdaten liegen.
const sepaDataFile = path.join(dataDir, 'sepa-data.ndjson');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const appendRecord = async (file: string, record: object, errorMessage: string): Promise<void> => {
  const line = JSON.stringify(record) + '\n';
  try {
    await fs.promises.appendFile(file, line);
  } catch (error) {
    console.error(errorMessage, error);
    // TODO Error Handling
    throw new Error(errorMessage);
  }
};

/**
 * Speichert ein Datenobjekt in der NDJSON-Datei.
 * @param type Der Typ des Datensatzes (z.B. 'email-contact', 'course-registration').
 * @param data Das zu speichernde Objekt.
 */
export const saveData = async (type: string, data: object): Promise<void> => {
  const record = {
    type,
    timestamp: new Date().toISOString(),
    ...data,
  };

  await appendRecord(dataFile, record, 'Daten konnten nicht gespeichert werden.');
};

/**
 * Speichert verschlüsselte SEPA/IBAN-Daten getrennt von den übrigen
 * Registrierungsdaten. `data` darf nur bereits verschlüsselte Feldwerte
 * (siehe crypto-service.ts) sowie eine registrationId zur Verknüpfung
 * enthalten, niemals eine IBAN im Klartext.
 */
export const saveSepaData = async (data: { registrationId: string; ibanEncrypted: string }): Promise<void> => {
  const record = {
    timestamp: new Date().toISOString(),
    ...data,
  };

  await appendRecord(sepaDataFile, record, 'SEPA-Daten konnten nicht gespeichert werden.');
};
