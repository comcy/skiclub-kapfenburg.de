/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CourseRegistration } from '../domain/course-registration.js';
import { MAIL_TEMPLATE_SETTING_KEY, MailTemplateSettings, NOTIFICATION_BCC_SETTING_KEY, NotificationBccSetting } from '../domain/settings.js';
import { renderTemplate } from './mail-template-engine.js';
import { getSetting } from './settings-service.js';

// Same default recipients as the removed client-side default (see the
// plan) - used only when the admin hasn't configured a global BCC list yet.
// No per-tile override anymore (intentional scope cut, see the plan).
const DEFAULT_BCC_LIST = 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';

// Ported from the removed src/web/projects/data/mail-templates/course-confirmation-mail.function.ts
// - same placeholder token names: {{firstName}}, {{lastName}}, {{sportType}},
// {{level}}, {{birthday}}, {{email}}, {{phone}}, {{additionalText}}.
export const DEFAULT_COURSE_INTRO_HTML = `<p>wir freuen uns, dass dir unser Angebot gefällt, und bestätigen hiermit deine Anmeldung zum Kurs "{{sportType}}".</p>`;

export const DEFAULT_COURSE_TERMS_HTML = `<h2>Allgemeine Informationen und Hinweise</h2>

<h3>Kurse</h3>
<ol>
    <li>Bei geeigneter Wetterlage wirst du telefonisch mit allen nötigen Information benachrichtigt (das kann teilweise sehr kurzfristig passieren, da wir auf Wetteränderungen reagieren müssen)</li>
    <li>Bei geeigneter Wetterlage finden die Kurse bei uns im heimischen Gelände (Skilift an der Kapfenburg) statt.</li>
    <li>Lässt es die Wetterlage im heimischen Gelände nicht zu, bieten wir spezielle Kursausfahrten mit Kursen an:
        <ul>
            <li><b>Trainingstag ins Allgäu (09. Januar 2027)</b></li>
            <li><b>Tagesausfahrt nach Ehrwald (23. Januar 2027)</b></li>
        </ul>
        <p style="color: #e60f00; font-weight: bold;">Wichtig: Hierzu muss eine Anmeldung zur jeweiligen Ausfahrt erfolgen, diese Registrierung reicht dazu nicht aus!</p>
    </li>
</ol>

<h3>Preise</h3>
<ul>
    <li>Die aktuell gültigen Preise findest du auf unserer <a href="https://www.skiclub-kapfenburg.de/courses">Website</a></li>

<p style="color: #0073e6; font-weight: bold;">Unsere Mitglieder erhalten vergünstigte Konditionen auf Kurse und Ausfahrten. Schon ein Kinderjahresbeitrag bringt ein echtes Ersparnis. Unseren Mitgliedsantrag findest du
    <a href="https://www.skiclub-kapfenburg.de/trips/downloads" style="color: #0073e6; text-decoration: underline;">
        hier.
    </a>
</p>
<p>Weitere Informationen und Bedingungen findest du ebenfalls auf unserer Website unter: <a href="https://www.skiclub-kapfenburg.de/courses" style="color: #0073e6; text-decoration: none;">Allgemeine Informationen zu unseren Kurse</a>
</p>`;

export const DEFAULT_COURSE_SIGNATURE_HTML = `<p style="margin: 15px 0 0 0; font-size: 16px;">Schöne Grüße,</p>
<p style="margin: 0; font-weight: bold; font-size: 16px;">Das Team des Skiclub Kapfenburg e.V.</p>


<div style="font-size: 14px;"></div>
<p style="margin: 15px 0 0 0;">Unseren Mitgliedsantrag findest du hier:</p>
<p style="margin: 0;">
    <a href="https://1drv.ms/b/s!AlpybhuWN2nhge8dP6xXiAadleW0vw?e=lKCaLA" style="color: #0073e6; text-decoration: none;">
        > Mitglied werden
    </a>
</p>`;

export const getCourseConfirmationMailSubject = (registration: CourseRegistration): string =>
  `SC-Kapfenburg Kursanmeldung: ${registration.sportType} / ${registration.level}`;

export const getCourseConfirmationMailBcc = (): string => {
  const globalList = getSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY)?.customBccList;
  if (globalList && globalList.length > 0) {
    return globalList.join(',');
  }
  return DEFAULT_BCC_LIST;
};

export const getCourseConfirmationMailText = (registration: CourseRegistration): string => {
  const placeholders: Record<string, string> = {
    firstName: registration.firstName,
    lastName: registration.lastName,
    sportType: registration.sportType ?? '',
    level: registration.level ?? '',
    birthday: registration.birthday ?? '',
    email: registration.email ?? '',
    phone: registration.phone ?? '',
    additionalText: registration.notes ?? '',
  };
  const cfg = getSetting<MailTemplateSettings>(MAIL_TEMPLATE_SETTING_KEY)?.course;
  const introHtml = renderTemplate(cfg?.introHtml || DEFAULT_COURSE_INTRO_HTML, placeholders);
  const termsHtml = renderTemplate(cfg?.termsHtml || DEFAULT_COURSE_TERMS_HTML, placeholders);
  const signatureHtml = renderTemplate(cfg?.signatureHtml || DEFAULT_COURSE_SIGNATURE_HTML, placeholders);

  return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding-top: 8px; padding-bottom: 16px;">
            <h1 style="color: #0073e6;">${registration.sportType} - Deine Anmeldung beim Skiclub Kapfenburg e.V.</h1>
            <p>Hallo ${registration.firstName},</p>

            ${introHtml}

            <p>Wir haben folgende Daten registriert:</p>

            <div style="display: flex; border-left: 4px solid #ac1dee; padding-left: 16px; font-family: Arial, sans-serif;">
                <!-- Linke Spalte -->
                <div style="flex: 1; padding-right: 16px;">
                    <p style="margin: 0; font-weight: bold; font-size: 1.2em; color: #0073e6;">
                        ${registration.firstName} ${registration.lastName}
                    </p>
                    <p style="margin: 4px 0;">E-Mail: <span style="font-weight: bold; color: #333;">${registration.email ?? ''}</span></p>
                    <p style="margin: 4px 0;">Telefon: <span style="font-weight: bold; color: #333;">${registration.phone ?? ''}</span></p>
                </div>

                <!-- Rechte Spalte -->
                <div style="flex: 1; padding-left: 16px;">
                    <p style="margin: 4px 0;">Sportart: <span style="font-weight: bold; color: #333;">${registration.sportType ?? ''}</span></p>
                    <p style="margin: 4px 0;">Geburtsdatum: <span style="font-weight: bold; color: #333;">${registration.birthday ?? ''}</span></p>
                    <p style="margin: 4px 0;">Zusatzangaben:</p>
                    <div style="padding: 8px; background-color: #0073e610; border-radius: 4px; border: 1px solid #ddd;">
                        <p style="margin: 0; color: #333; padding-left: 8px;">${registration.notes ?? ''}</p>
                    </div>
                </div>
            </div>


            <div style="background-color: #f7f7f7; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${termsHtml}
            </div>

            ${signatureHtml}

            <hr style="border: none; border-top: 1px solid #ddd; margin: 8px 0;">
            <small style="color: #999; padding-bottom: 16px;">Diese Nachricht wurde automatisch generiert. Solltest du Fragen oder Probleme mit der Darstellung dieser E-Mail haben, nehme bitte baldmöglichst Kontakt mit uns auf.</small>
        </div>`;
};
