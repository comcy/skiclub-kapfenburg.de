/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import crypto from 'crypto';

// Feldweise Verschlüsselung (z.B. IBAN). Schlüssel kommt aus einer
// Umgebungsvariable, nicht aus der Datenbank/dem Repo.
const ALGORITHM = 'aes-256-gcm';

const getKey = (): Buffer => {
  const keyHex = process.env.SEPA_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error('SEPA_ENCRYPTION_KEY ist nicht gesetzt.');
  }
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('SEPA_ENCRYPTION_KEY muss ein 32 Byte langer Hex-String (64 Zeichen) sein.');
  }
  return key;
};

/**
 * Verschlüsselt einen einzelnen Feldwert (z.B. IBAN) mit AES-256-GCM.
 * Ergebnisformat: "iv:authTag:ciphertext" (jeweils hex-kodiert).
 */
export const encryptField = (plainText: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((buf) => buf.toString('hex')).join(':');
};

/**
 * Entschlüsselt einen mit encryptField() verschlüsselten Feldwert.
 * Wird aktuell nicht von einer Route genutzt (Einsicht erfordert ein
 * eigenes Recht aus dem parallelen admin-app-Feature), steht aber als
 * Gegenstück zu encryptField() bereit.
 */
export const decryptField = (cipherText: string): string => {
  const [ivHex, authTagHex, dataHex] = cipherText.split(':');
  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error('Ungültiges Ciphertext-Format.');
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
};
