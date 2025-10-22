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

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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

  const line = JSON.stringify(record) + '\n';

  try {
    await fs.promises.appendFile(dataFile, line);
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
    // TODO Error Handling
    throw new Error('Daten konnten nicht gespeichert werden.');
  }
};
