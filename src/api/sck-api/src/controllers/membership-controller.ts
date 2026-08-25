/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { FamilyMember, MembershipRegistrationRequestBody } from '../domain/membership.js';
import { listDataByType, saveData, saveSepaData } from '../services/data-service.js';
import { encryptField } from '../services/crypto-service.js';
import { createMailTransporter, defaultSender } from '../services/mailer.js';
import { confirmRegistration, createConfirmationToken } from '../services/membership-confirmation-service.js';
import {
  MEMBERSHIP_BOARD_RECIPIENTS,
  getMembershipBoardNotificationMailSubject,
  getMembershipBoardNotificationMailText,
  getMembershipOptInMailSubject,
  getMembershipOptInMailText,
} from '../services/membership-mail-service.js';

const SCK_APP_URL = process.env.SCK_APP_URL || 'http://localhost:4200';

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

    // Double-Opt-in: der Vorstand wird erst benachrichtigt, wenn der
    // Antragsteller über den Link in dieser Mail bestätigt (siehe
    // confirmMembershipRegistration unten) - ein roher, unbestätigter
    // Antrag erreicht den Vorstand nie.
    const confirmationToken = createConfirmationToken(registrationId);
    const confirmUrl = `${SCK_APP_URL}/mitgliedschaft/bestaetigen?token=${confirmationToken}`;

    // E-Mail-Versand ist Best-Effort: Der Antrag ist bereits gespeichert,
    // ein Mailversand-Fehler soll die erfolgreiche Registrierung nicht
    // rückgängig machen (kein eigener Notification-Service in diesem
    // Feature, siehe FEATURE_BRIEF.md).
    try {
      const transporter = createMailTransporter();

      await transporter.sendMail({
        from: defaultSender(),
        to: registrationData.email,
        subject: getMembershipOptInMailSubject(),
        html: getMembershipOptInMailText(registrationData, confirmUrl),
      });
    } catch (mailError) {
      console.error('Fehler beim Versand der Mitgliedsantrag-Opt-in-Mail:', mailError);
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

export const confirmMembershipRegistration: RequestHandler = async (req, res) => {
  try {
    const token = req.body?.token;
    if (typeof token !== 'string' || !token) {
      res.status(400).json({ error: 'Bestätigungs-Token fehlt.' });
      return;
    }

    const result = confirmRegistration(token);
    if (!result) {
      res.status(404).json({ error: 'Der Bestätigungslink ist ungültig oder abgelaufen.' });
      return;
    }

    // Board-Mail nur beim ersten erfolgreichen Klick, nicht bei jedem
    // (idempotenten) Wiederaufruf desselben Links.
    if (!result.alreadyConfirmed) {
      const registrationData = listDataByType<MembershipRegistrationRequestBody & { registrationId: string }>(
        'membership-registration',
      ).find((registration) => registration.registrationId === result.registrationId);

      if (registrationData) {
        try {
          const transporter = createMailTransporter();
          await transporter.sendMail({
            from: defaultSender(),
            to: MEMBERSHIP_BOARD_RECIPIENTS,
            subject: getMembershipBoardNotificationMailSubject(registrationData),
            html: getMembershipBoardNotificationMailText(registrationData),
          });
        } catch (mailError) {
          console.error('Fehler beim Versand der Vorstands-Benachrichtigung:', mailError);
        }
      }
    }

    res.status(200).json({ confirmed: true });
  } catch (error: any) {
    console.error('Fehler bei der Bestätigung des Mitgliedsantrags:', error);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung Ihrer Anfrage.' });
  }
};
