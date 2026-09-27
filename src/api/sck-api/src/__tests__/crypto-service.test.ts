process.env.SEPA_ENCRYPTION_KEY = '0'.repeat(64);

const { encryptField, decryptField } = await import('../services/crypto-service');

describe('CryptoService', () => {
  it('sollte einen Feldwert verschlüsseln und wieder entschlüsseln (Round-Trip)', () => {
    const iban = 'DE89370400440532013000';

    const encrypted = encryptField(iban);

    expect(encrypted).not.toContain(iban);
    expect(decryptField(encrypted)).toBe(iban);
  });

  it('sollte für denselben Wert unterschiedliche Ciphertexte erzeugen (zufälliger IV)', () => {
    const iban = 'DE89370400440532013000';

    expect(encryptField(iban)).not.toBe(encryptField(iban));
  });

  it('sollte ohne gesetzten Schlüssel einen Fehler werfen', () => {
    const original = process.env.SEPA_ENCRYPTION_KEY;
    delete process.env.SEPA_ENCRYPTION_KEY;

    expect(() => encryptField('DE89370400440532013000')).toThrow('SEPA_ENCRYPTION_KEY ist nicht gesetzt.');

    process.env.SEPA_ENCRYPTION_KEY = original;
  });
});
