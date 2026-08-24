/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { FamilyMember, MembershipRegistrationRequestBody } from '../domain/membership.js';
import { saveData, saveSepaData } from '../services/data-service.js';
import { encryptField } from '../services/crypto-service.js';
import { createMailTransporter, defaultSender } from '../services/mailer.js';
import {
  MEMBERSHIP_BOARD_RECIPIENTS,
  getMembershipBoardNotificationMailSubject,
  getMembershipBoardNotificationMailText,
  getMembershipConfirmationMailSubject,
  getMembershipConfirmationMailText,
} from '../services/membership-mail-service.js';

const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/;

const isValidFamilyMember = (member: unknown): member is FamilyMember => {
  if (typeof member !== 'object' || member === null) return false;
  const m = member as Partial<FamilyMember>;
  return Boolean(m.firstName && m.lastName && m.birthday);
};

/**
 * Validiert die Pflichtfelder analog zum bestehenden Muster in
 * registration-controller.ts. Gibt bei einem Fehler die Fehlermeldung
 * zurück, sonst null.
 */
const validateRegistrationData = (data: MembershipRegistrationRequestBody): string | null => {
  if (!data.firstName || !data.lastName || !data.birthday || !data.address || !data.email || !data.phone) {
    return 'Name, Geburtstag, Adresse, E-Mail und Telefon sind erforderlich.';
  }

  if (!data.termsAccepted) {
    return 'Die Beitrittserklärung muss bestätigt werden.';
  }

  if (!data.privacyAccepted) {
    return 'Die Datenschutzerklärung muss bestätigt werden.';
  }

  if (!data.sepaMandateAccepted) {
    return 'Das SEPA-Lastschriftmandat muss erteilt werden.';
  }

  if (!data.iban || !IBAN_REGEX.test(data.iban.replace(/\s+/g, '').toUpperCase())) {
    return 'Eine gültige IBAN ist erforderlich.';
  }

  if (data.isFamilyMembership && data.familyMembers) {
    if (!Array.isArray(data.familyMembers) || !data.familyMembers.every(isValidFamilyMember)) {
      return 'Familienmitglieder benötigen jeweils Vorname, Nachname und Geburtstag.';
    }
  }

  return null;
};

export const createMembershipRegistration: RequestHandler = async (req, res) => {
  try {
    const registrationData = req.body as MembershipRegistrationRequestBody;

    const validationError = validateRegistrationData(registrationData);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const registrationId = randomUUID();
    const { iban, ...registrationWithoutIban } = registrationData;

    // Übrige Antragsdaten und SEPA/IBAN getrennt speichern. Die IBAN
    // landet feldweise verschlüsselt in einer eigenen Datei/"Tabelle".
    await saveData('membership-registration', { registrationId, ...registrationWithoutIban });
    await saveSepaData({ registrationId, ibanEncrypted: encryptField(iban) });

    // E-Mail-Versand ist Best-Effort: Der Antrag ist bereits gespeichert,
    // ein Mailversand-Fehler soll die erfolgreiche Registrierung nicht
    // rückgängig machen (kein eigener Notification-Service in diesem
    // Feature, siehe FEATURE_BRIEF.md).
    try {
      const transporter = createMailTransporter();

      await transporter.sendMail({
        from: defaultSender(),
        to: registrationData.email,
        subject: getMembershipConfirmationMailSubject(),
        html: getMembershipConfirmationMailText(registrationData),
      });

      await transporter.sendMail({
        from: defaultSender(),
        to: MEMBERSHIP_BOARD_RECIPIENTS,
        subject: getMembershipBoardNotificationMailSubject(registrationData),
        html: getMembershipBoardNotificationMailText(registrationData),
      });
    } catch (mailError) {
      console.error('Fehler beim Versand der Mitgliedsantrag-E-Mails:', mailError);
    }

    res.status(201).json({
      message: 'Mitgliedsantrag erfolgreich gespeichert.',
      registrationId,
    });
  } catch (error: any) {
    console.error('Fehler bei der Erstellung des Mitgliedsantrags:', error);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung Ihrer Anfrage.' });
  }
};
