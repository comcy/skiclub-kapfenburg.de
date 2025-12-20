/**
 * @copyright Copyright (c) 2024 Christian Silfang
 */

import {
    TripRegisterFormFields,
    TripRegisterParticipant,
} from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';

export const getTripConfirmationSuccessMessage = (): string => {
    return `Alle Angaben wurden übertragen. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;
};

export const getTripConfirmationMailSubject = (values: TripRegisterFormFields): string => {
    return `SC-Kapfenburg Anmeldung: ${values.participants[0].firstName}`;
};

export const getTripConfirmationMailBcc = (): string => {
    // return 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';
    return 'christian.silfang@gmail.com';
};

const formatDateDE = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('de-DE');
};

const renderParticipant = (participant: TripRegisterParticipant, title?: string): string => `
    <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        ${title ? `<h3 style="margin-bottom: 8px; color: #0073e6;">${title}</h3>` : ''}

        <p style="margin: 0; font-weight: bold; font-size: 1.1em;">
            ${participant.firstName} ${participant.lastName}
        </p>

        <p style="margin: 4px 0;">
            Geburtstdatum: <strong>${formatDateDE(participant.birthday)}</strong>
        </p>
        <p style="margin: 4px 0;">
            E-Mail: <strong>${participant.email}</strong>
        </p>
        <p style="margin: 4px 0;">
            Telefon: <strong>${participant.phone}</strong>
        </p>
        <p style="margin: 4px 0;">
            Zugstieg: <strong>${participant.boarding}</strong>
        </p>
    </div>
`;

export const getTripConfirmationMailText = (values: TripRegisterFormFields): string => {
    const [contactPerson, ...additionalParticipants] = values.participants;

    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding-top: 8px; padding-bottom: 16px;">
            
            <h1 style="color: #0073e6;">
                Anmeldung beim Skiclub Kapfenburg e.V. zur Ausfahrt
                "${values.trip.destination}" am ${values.trip.date}
            </h1>

            <p>Hallo ${contactPerson.firstName},</p>

            <p>
                wir freuen uns, dass dir unser Angebot gefällt, und bestätigen hiermit eure Anmeldung.
                Bitte prüfe die folgenden Daten auf Richtigkeit.
            </p>

            <p>Wir haben folgende Teilnehmer registriert:</p>

            <div style="border-left: 4px solid #ac1dee; padding-left: 16px;">
                
                <!-- Ansprechpartner -->
                ${renderParticipant(contactPerson, 'Ansprechpartner')}

                <!-- Zusatzpersonen -->
                ${
                    additionalParticipants.length > 0
                        ? `
                            <h3 style="margin-top: 24px; color: #0073e6;">
                                Zusatzpersonen
                            </h3>
                            ${additionalParticipants.map((p) => renderParticipant(p)).join('')}
                          `
                        : ''
                }
            </div>

            ${
                values.additionalText
                    ? `
                        <p style="margin-top: 16px;">Zusatzangaben:</p>
                        <div style="padding: 8px; background-color: #0073e610; border-radius: 4px; border: 1px solid #ddd;">
                            <p style="margin: 0;">${values.additionalText}</p>
                        </div>
                      `
                    : ''
            }

        <div style="background-color: #f7f7f7; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <h2>Aktuelle Teilnahmebedingungen</h2>
                
                <h3>Gültigkeit der Anmeldung, Anzahlung und Stornierung</h3>
                <ul>
                    <li>Die Anmeldung ist erst gültig bei einer Anzahlung von 30 EUR pro Person (entspricht der Busgebühr). Der restliche Betrag wird üblicherweise in Bar am Tag der Reise kassiert, andernfalls sind Vollzahlungen vorab ebenfalls möglich.
                        
                        <div style="padding-left: 8px; border-left: 4px solid#ac1dee; margin-top: 16px; margin-bottom: 16px;">
                            <p style="margin: 0; font-weight: bold; font-size: 14px;">Skiclub Kapfenburg e.V.</p>
                            <p style="margin: 0;">BIC: <span style="font-weight: bold;">GENODES1AAV</span></p>
                            <p style="margin: 0;">IBAN: <span style="font-weight: bold;">DE61 6149 0150 0131 4700 00</span></p>
                            <p style="margin: 0;">Verwendungszweck: <em>Name auf der Anmeldung + Name der Ausfahrt</em></p>
                        </div>

                    </li>
                    <li>Anmeldeschluss sowie die Möglichkeit zur Stornierung der Anmeldung besteht bis zum Dienstag vor der Ausfahrt. Die geleistete Zahlung wird dir in diesem Fall zurück erstattet</li>
                    <li>Im Falle einer kurzfristigen Absage oder eines Nichterscheinens behalten wir uns vor, den Buspreis in Rechnung zu stellen bzw. die Anzahlung einzubehalten</li>
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
                </p>
            </div>
            

            <p style="margin: 15px 0 0 0; font-size: 16px;">Schöne Grüße,</p>
            <p style="margin: 0; font-weight: bold; font-size: 16px;">Das Team des Skiclub Kapfenburg e.V.</p>
            
            <div style="font-size: 14px;"></div>
            <p style="margin: 15px 0 0 0;">Unseren Mitgliedsantrag findest du unter:</p>
            <p style="margin: 0;">
                <a href="https://1drv.ms/b/s!AlpybhuWN2nhge8dP6xXiAadleW0vw?e=lKCaLA" style="color: #0073e6; text-decoration: none;">
                    > Mitglied werden
                </a>
            </p>


            <hr style="border: none; border-top: 1px solid #ddd; margin: 8px 0;">
            <small style="color: #999; padding-bottom: 16px;">Diese Nachricht wurde automatisch generiert. Solltest du Fragen oder Probleme mit der Darstellung dieser E-Mail haben, nehme bitte baldmöglichst Kontakt mit uns auf.</small>
        </div>
    `;
};
