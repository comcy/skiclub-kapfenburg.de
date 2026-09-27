/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile } from '../domain/tile.js';
import { MAIL_TEMPLATE_SETTING_KEY, MailTemplateSettings, NOTIFICATION_BCC_SETTING_KEY, NotificationBccSetting } from '../domain/settings.js';
import { PublicRegistrationResult, RegistrationStatus, TripRegistration } from '../domain/trip-registration.js';
import { renderTemplate } from './mail-template-engine.js';
import { getSetting } from './settings-service.js';
import { calculateParticipantPrice, getCurrentTripPricing } from './trip-pricing-service.js';

// Same default recipients as the removed client-side default (see the
// plan) - used only when the admin hasn't configured a global BCC list yet.
// No per-tile override anymore (intentional scope cut, see the plan).
const DEFAULT_BCC_LIST = 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';

// Ported from the removed src/web/projects/data/mail-templates/trip-confirmation-mail.function.ts
// - same placeholder token names: {{firstName}}, {{destination}}, {{date}},
// {{totalPrice}}, {{additionalText}}.
export const DEFAULT_TRIP_INTRO_HTML = `<p>
    wir freuen uns über eure Anmeldung! Bitte prüfe die folgenden Daten auf Richtigkeit.
</p>`;

// Additional placeholders: {{waitlistGroupText}} ("1 Person"/"2 Personen"), {{waitlistPosition}}
export const DEFAULT_TRIP_WAITLIST_HTML = `<div style="margin-bottom: 16px; padding: 16px; border: 1px solid #f5c400; border-radius: 8px; background-color: #fff8e1;">
    <strong>Du stehst aktuell auf der Warteliste.</strong><br>
    Diese Ausfahrt ist bereits ausgebucht. Deine Anmeldung wurde als Gruppe mit
    {{waitlistGroupText}}
    auf Position {{waitlistPosition}} der Warteliste eingetragen.
    Solltest du nachrücken, melden wir uns bei dir.
</div>`;

export const DEFAULT_TRIP_TERMS_HTML = `<h2>Aktuelle Teilnahmebedingungen</h2>

<h3>Gültigkeit der Anmeldung und Stornierung</h3>
<ul>
    <li>Die Anmeldung ist mit dem Absenden dieses Formulars gültig. Die Kosten werden vollständig bar im Bus am Tag der Ausfahrt eingesammelt.</li>
    <li>Anmeldeschluss sowie die Möglichkeit zur Stornierung der Anmeldung besteht bis zum Dienstag vor der Ausfahrt.</li>
    <li>Im Falle einer kurzfristigen Absage oder eines Nichterscheinens behalten wir uns vor, den Buspreis in Rechnung zu stellen</li>
</ul>

<h3>Teilnahme von Minderjährigen</h3>
<ul>
    <li>Für Minderjährige Teilnehmer besteht immer Helmpflicht, insbesondere bei Kursteilnahme</li>
    <li>Minderjährige Teilnehmer unter 18 Jahren, aber über 16 Jahren müssen ohne erziehungsberechtigte Begleitung eine Einverständniserklärung (bspw. mittels <a href="https://www.skiclub-kapfenburg.de/trips/downloads" style="color: #0073e6; text-decoration: none;">
        "Einverständniserklärung U18"</a>) der Eltern <span style="text-decoration: underline;">vor Reiseantritt per E-Mail</span> vorlegen</li>
    <li>Minderjährige Teilnehmer unter 16 Jahren können nur in Begleitung einer erziehungsberechtigten Person oder einer vom Erziehungsberechtigten bestimmten Aufsichtsperson an den Ausfahrten teilnehmen.
        Wir bestehen auf eine schrifliche Mitteilung (bspw. mittels SCK-Vordruck <a href="https://www.skiclub-kapfenburg.de/trips/downloads" style="color: #0073e6; text-decoration: none;">
            "Übetragung Aufsichtspflicht")
        </a><span style="text-decoration: underline;">vor Reiseantritt per E-Mail</span></li>
</ul>

<p style="color: #e60f00; font-weight: bold;">Die Teilnahme geschieht immer auf eigene Gefahr!</p>
<p>Weitere Informationen und Bedingungen findest du ebenfalls auf unserer Website unter: <a href="https://www.skiclub-kapfenburg.de/trips/information" style="color: #0073e6; text-decoration: none;">Allgemeine Informationen zu unseren Ausfahrten</a>
</p>`;

export const DEFAULT_TRIP_SIGNATURE_HTML = `<p style="margin-top: 30px;">Schöne Grüße,<br><strong>Dein Team vom Skiclub Kapfenburg e.V.</strong></p>`;

export const getTripConfirmationMailSubject = (contactFirstName: string, status: RegistrationStatus): string => {
  const waitlistSuffix = status === 'waitlist' ? ' (Warteliste)' : '';
  return `SC-Kapfenburg Anmeldung: ${contactFirstName}${waitlistSuffix}`;
};

export const getTripConfirmationMailBcc = (): string => {
  const globalList = getSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY)?.customBccList;
  if (globalList && globalList.length > 0) {
    return globalList.join(',');
  }
  return DEFAULT_BCC_LIST;
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

// "Geb." (Geburtsdatum)/Alter kann hier nicht angezeigt werden wie im
// ursprünglichen Client-Rendering - trip_registrations persistiert bewusst
// nur die daraus abgeleitete ageCategory, nicht das Geburtsdatum selbst
// (siehe die Spaltenliste im Plan). Stattdessen die Alterskategorie als Text.
const AGE_CATEGORY_LABEL: Record<TripRegistration['ageCategory'], string> = {
  adult: 'Erwachsen',
  youthUntil16: 'Jugend',
  childUntil6: 'Kind',
};

const renderParticipant = (participant: TripRegistration, title?: string): string => {
  const price = calculateParticipantPrice(
    {
      busOnly: participant.busOnly,
      snowshoes: participant.snowshoes,
      courseRequested: participant.courseRequested,
      level: participant.level,
      ageCategory: participant.ageCategory,
      isMember: participant.isMember,
    },
    getCurrentTripPricing(),
  );

  const options: string[] = [];
  options.push(participant.busOnly ? 'Nur Busfahrt (ohne Skipass)' : `Bus + Lift (${AGE_CATEGORY_LABEL[participant.ageCategory]})`);
  options.push(participant.isMember ? 'Mitglied' : 'Nicht-Mitglied');
  if (participant.snowshoes) options.push('Schneeschuhe');
  if (participant.courseRequested && participant.level) options.push(participant.level);

  return `
    <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        ${title ? `<h3 style="margin-top: 0; margin-bottom: 12px; color: #3f51b5; border-bottom: 1px solid #3f51b5; padding-bottom: 4px;">${title}</h3>` : ''}

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding-bottom: 8px;">
                    <span style="font-weight: bold; font-size: 1.1em; color: #333;">${participant.firstName} ${participant.lastName}</span>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="color: #555; font-size: 0.95em; padding-bottom: 12px;">
                    E-Mail: ${participant.email ?? ''} <br>
                    Tel: ${participant.phone ?? ''} | Zustieg: ${participant.boardingName ?? ''}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; border: 1px solid #eeeeee;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="font-size: 0.9em; color: #555; line-height: 1.4;">
                                ${options.join('<br>')}
                            </td>
                            <td style="text-align: right; font-weight: bold; color: #2e7d32; white-space: nowrap; vertical-align: bottom;">
                                ${formatCurrency(price)}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    `;
};

export const getTripConfirmationMailText = (
  tile: Tile,
  contactPerson: TripRegistration,
  allParticipants: TripRegistration[],
  waitlistInfo: PublicRegistrationResult,
): string => {
  const additionalParticipants = allParticipants.filter((p) => p.id !== contactPerson.id);
  const pricing = getCurrentTripPricing();
  const totalPrice = allParticipants.reduce(
    (sum, p) =>
      sum +
      calculateParticipantPrice(
        {
          busOnly: p.busOnly,
          snowshoes: p.snowshoes,
          courseRequested: p.courseRequested,
          level: p.level,
          ageCategory: p.ageCategory,
          isMember: p.isMember,
        },
        pricing,
      ),
    0,
  );

  const placeholders: Record<string, string> = {
    firstName: contactPerson.firstName,
    destination: tile.destination ?? '',
    date: tile.date,
    totalPrice: formatCurrency(totalPrice),
    additionalText: contactPerson.notes ?? '',
  };
  const cfg = getSetting<MailTemplateSettings>(MAIL_TEMPLATE_SETTING_KEY)?.trip;
  const termsHtml = renderTemplate(cfg?.termsHtml || DEFAULT_TRIP_TERMS_HTML, placeholders);
  const signatureHtml = renderTemplate(cfg?.signatureHtml || DEFAULT_TRIP_SIGNATURE_HTML, placeholders);

  const introOrWaitlistHtml =
    waitlistInfo.status === 'waitlist'
      ? renderTemplate(cfg?.waitlistHtml || DEFAULT_TRIP_WAITLIST_HTML, {
          ...placeholders,
          waitlistGroupText: waitlistInfo.waitlistCount === 1 ? '1 Person' : `${waitlistInfo.waitlistCount} Personen`,
          waitlistPosition: `${waitlistInfo.waitlistPosition}`,
        })
      : renderTemplate(cfg?.introHtml || DEFAULT_TRIP_INTRO_HTML, placeholders);

  return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">

            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">

                <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">
                    Anmeldebestätigung
                </h1>
                <p style="font-size: 16px; font-weight: bold; color: #555;">
                    Ausfahrt: ${tile.destination ?? ''} <br>
                    Datum: ${tile.date}
                </p>

                <p>Hallo ${contactPerson.firstName},</p>

                ${introOrWaitlistHtml}

                <div style="margin-top: 20px;">
                    ${renderParticipant(contactPerson, 'Ansprechpartner')}

                    ${
                      additionalParticipants.length > 0
                        ? `
                                <h3 style="margin: 24px 0 16px 0; color: #3f51b5;">Zusatzpersonen</h3>
                                ${additionalParticipants.map((p) => renderParticipant(p)).join('')}
                              `
                        : ''
                    }
                </div>

                <!-- Gesamtsumme -->
                <div style="margin-top: 32px; padding: 20px; background-color: #fafafa; border: 2px solid #3f51b5; border-radius: 8px;">
                    <table style="width: 100%; font-size: 1.2em;">
                        <tr>
                            <td><strong>Gesamtsumme</strong></td>
                            <td style="text-align: right; color: #2e7d32;"><strong>${formatCurrency(totalPrice)}</strong></td>
                        </tr>
                    </table>
                </div>

                ${
                  contactPerson.notes
                    ? `
                            <div style="margin-top: 24px; padding: 12px; border-left: 4px solid #3f51b5; background-color: #f0f2f9;">
                                <strong>Zusatzangaben:</strong><br>
                                ${contactPerson.notes}
                            </div>
                          `
                    : ''
                }

        <div style="background-color: #f7f7f7; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    ${termsHtml}
            </div>

                ${signatureHtml}

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
            </div>
        </div>
    `;
};
