/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Ältere (gecachte) Website-Versionen schickten das Datepicker-Date als UTC-Zeitstempel
// ("2000-05-09T22:00:00.000Z" für den 10.5.") - zurück auf den Berliner Kalendertag.
export const normalizeBirthday = (value: string | undefined): string | undefined => {
  if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
};
