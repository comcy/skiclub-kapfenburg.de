/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { FamilyMember, MembershipRegistrationRequestBody } from '../domain/membership.js';

// Fixe Empfänger-Liste für Vorstand/Kassenwart, analog zum bestehenden
// Muster für Ausfahrten (getTripConfirmationMailBcc in
// projects/data/mail-templates/trip-confirmation-mail.function.ts).
export const MEMBERSHIP_BOARD_RECIPIENTS = 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';

// Nur die letzten 4 Stellen zeigen. Die volle IBAN ist auch in der
// Bestätigungsmail an den Antragsteller nichts, was per Klartext-E-Mail
// verschickt werden sollte (E-Mail ist kein sicherer Kanal), auch wenn es
// die eigenen Daten des Antragstellers sind.
export const maskIban = (iban: string): string => {
  const normalized = iban.replace(/\s+/g, '');
  if (normalized.length <= 4) return normalized;
  return `${'*'.repeat(normalized.length - 4)}${normalized.slice(-4)}`;
};

const renderFamilyMembers = (familyMembers?: FamilyMember[]): string => {
  if (!familyMembers || familyMembers.length === 0) return '';
  const rows = familyMembers
    .map((m) => `<li>${m.firstName} ${m.lastName} (geb. ${m.birthday})</li>`)
    .join('');
  return `
    <p><strong>Weitere Familienmitglieder:</strong></p>
    <ul>${rows}</ul>
  `;
};

export const getMembershipConfirmationMailSubject = (): string => {
  return 'SC-Kapfenburg Mitgliedsantrag: Eingangsbestätigung';
};

/**
 * Bestätigungsmail an den Antragsteller: reine Eingangsbestätigung mit den
 * eingegebenen Daten zur Kontrolle (Vorbild: getTripConfirmationMailText).
 */
export const getMembershipConfirmationMailText = (data: MembershipRegistrationRequestBody): string => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">
        <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">Mitgliedsantrag: Eingangsbestätigung</h1>
        <p>Hallo ${data.firstName},</p>
        <p>vielen Dank für deinen Mitgliedsantrag beim Skiclub Kapfenburg e.V. Bitte prüfe die folgenden Angaben auf Richtigkeit.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 4px 0; color: #555;">Name</td><td style="padding: 4px 0;"><strong>${data.firstName} ${data.lastName}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Geburtstag</td><td style="padding: 4px 0;">${data.birthday}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Adresse</td><td style="padding: 4px 0;">${data.address}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">E-Mail</td><td style="padding: 4px 0;">${data.email}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Telefon</td><td style="padding: 4px 0;">${data.phone}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Familienmitgliedschaft</td><td style="padding: 4px 0;">${data.isFamilyMembership ? 'Ja' : 'Nein'}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">SEPA-Lastschriftmandat</td><td style="padding: 4px 0;">${data.sepaMandateAccepted ? 'erteilt' : 'nicht erteilt'} (IBAN: ${maskIban(data.iban)})</td></tr>
        </table>

        ${renderFamilyMembers(data.familyMembers)}

        <p style="margin-top: 24px;">Die Bearbeitung deines Antrags sowie die Verarbeitung des Lastschriftmandats erfolgt durch unseren Kassenwart. Bei Rückfragen kontaktiere uns bitte über registration@skiclub-kapfenburg.de.</p>

        <p style="margin-top: 30px;">Schöne Grüße,<br><strong>Dein Team vom Skiclub Kapfenburg e.V.</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
      </div>
    </div>
  `;
};

export const getMembershipBoardNotificationMailSubject = (data: MembershipRegistrationRequestBody): string => {
  return `Neuer Mitgliedsantrag: ${data.firstName} ${data.lastName}`;
};

/**
 * Benachrichtigungsmail an Vorstand/Kassenwart. Enthält bewusst NICHT die
 * IBAN (auch nicht maskiert) — nur den Hinweis, dass ein Mandat erteilt
 * wurde, sowie nicht-sensible Eckdaten. Die Sichtung der SEPA-Daten läuft
 * über das separate, granulare Recht (feature/admin-app), nicht per Mail.
 */
export const getMembershipBoardNotificationMailText = (data: MembershipRegistrationRequestBody): string => {
  const familyCount = data.familyMembers?.length ?? 0;
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">
        <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">Neuer Mitgliedsantrag eingegangen</h1>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 4px 0; color: #555;">Name</td><td style="padding: 4px 0;"><strong>${data.firstName} ${data.lastName}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Geburtstag</td><td style="padding: 4px 0;">${data.birthday}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">E-Mail</td><td style="padding: 4px 0;">${data.email}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Telefon</td><td style="padding: 4px 0;">${data.phone}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">Familienmitgliedschaft</td><td style="padding: 4px 0;">${data.isFamilyMembership ? `Ja (${familyCount} weitere Person(en))` : 'Nein'}</td></tr>
          <tr><td style="padding: 4px 0; color: #555;">SEPA-Lastschriftmandat</td><td style="padding: 4px 0;">${data.sepaMandateAccepted ? 'erteilt' : 'nicht erteilt'}</td></tr>
        </table>

        <p style="margin-top: 24px;">Die IBAN wird aus Sicherheitsgründen nicht per E-Mail versendet. Die SEPA-Mandatsverarbeitung erfolgt wie gewohnt manuell durch den Kassenwart.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
      </div>
    </div>
  `;
};
