/**
 * @copyright Copyright (c) 2024 Christian Silfang
 */

import { calculateAge, formatDateByLocale } from 'projects/shared-lib/src/lib/date-time';
import { TripParticipant } from 'projects/trips-lib/src/lib/domain/models';
import { TripRegisterFormValue } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';

export const getTripConfirmationSuccessMessage = (): string => {
    return `Alle Angaben wurden übertragen. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;
};

export const getTripConfirmationMailSubject = (values: TripRegisterFormValue): string => {
    return `SC-Kapfenburg Anmeldung: ${values.participants[0].firstName}`;
};

export const getTripConfirmationMailBcc = (values: TripRegisterFormValue): string => {
    const customList = values.trip.tripConfig?.customBccList;
    if (customList && customList.length > 0) {
        return customList.join(',');
    }
    // Default BCC List
    return 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';
};

const calculateParticipantPrice = (participant: TripParticipant, values: TripRegisterFormValue): number => {
    const pricing = values.trip.tripConfig?.pricing;
    if (!pricing) return 0;

    const isMember = participant.isMember;
    let totalPrice = 0;

    // 1. Bus + Lift or Bus Only
    if (participant.busOnly) {
        if (pricing.busOnly) {
            totalPrice += isMember ? pricing.busOnly.member : pricing.busOnly.nonMember;
        }
    } else if (pricing.busLift && participant.birthday) {
        // Use trip date as reference if possible, otherwise use today
        let refDate = new Date();
        if (values.trip.date) {
            const yearMatch = values.trip.date.match(/\d{4}/);
            if (yearMatch) {
                refDate = new Date(parseInt(yearMatch[0]), 5, 1);
            }
        }

        const age = calculateAge(participant.birthday, refDate);
        if (isNaN(age) || age < 0) return 0;

        let ageGroup: 'adult' | 'youthUntil16' | 'childUntil6' = 'adult';

        if (age <= 6) ageGroup = 'childUntil6';
        else if (age <= 16) ageGroup = 'youthUntil16';

        const groupPricing = pricing.busLift[ageGroup];
        if (groupPricing) {
            totalPrice += isMember ? groupPricing.member : groupPricing.nonMember;
        }
    } else {
        return 0;
    }

    // 2. Addons: Snowshoes
    if (participant.snowshoes && pricing.addons?.snowshoes) {
        totalPrice += isMember ? pricing.addons.snowshoes.member : pricing.addons.snowshoes.nonMember;
    }

    // 3. Addons: Course / Technik
    if (participant.courseRequested && pricing.addons && participant.level) {
        const level = participant.level;
        let coursePricing = null;

        if (level === 'Anfängerkurs') coursePricing = pricing.addons.courseBeginner;
        else if (level === 'Fortgeschrittenenkurs') coursePricing = pricing.addons.courseAdvanced;
        else if (level === 'Techniktraining (1/2 Tag)') coursePricing = pricing.addons.technikHalf;
        else if (level === 'Techniktraining (ganzer Tag)') coursePricing = pricing.addons.technikFull;

        if (coursePricing) {
            totalPrice += isMember ? coursePricing.member : coursePricing.nonMember;
        }
    }

    return totalPrice;
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

const renderParticipant = (participant: TripParticipant, values: TripRegisterFormValue, title?: string): string => {
    const price = calculateParticipantPrice(participant, values);
    const options = [];
    if (participant.busOnly) {
        options.push('Nur Busfahrt (ohne Skipass)');
    } else {
        // Reference date logic same as in price calculation for consistent display
        let refDate = new Date();
        if (values.trip.date) {
            const yearMatch = values.trip.date.match(/\d{4}/);
            if (yearMatch) {
                refDate = new Date(parseInt(yearMatch[0]), 5, 1);
            }
        }
        const age = calculateAge(participant.birthday, refDate);
        if (age <= 6) options.push('Bus + Lift (Kind)');
        else if (age <= 16) options.push('Bus + Lift (Jugend)');
        else options.push('Bus + Lift (Erwachsen)');
    }
    options.push(participant.isMember ? 'Mitglied' : 'Nicht-Mitglied');
    if (participant.snowshoes) options.push('Schneeschuhe');
    if (participant.courseRequested) options.push(`${participant.level} (${participant.sportType})`);

    return `
    <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        ${title ? `<h3 style="margin-top: 0; margin-bottom: 12px; color: #3f51b5; border-bottom: 1px solid #3f51b5; padding-bottom: 4px;">${title}</h3>` : ''}

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding-bottom: 8px;">
                    <span style="font-weight: bold; font-size: 1.1em; color: #333;">${participant.firstName} ${participant.lastName}</span>
                </td>
                <td style="text-align: right; padding-bottom: 8px;">
                    <span style="color: #666; font-size: 0.9em;">Geb.: ${formatDateByLocale(participant.birthday)} (${calculateAge(participant.birthday)} J.)</span>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="color: #555; font-size: 0.95em; padding-bottom: 12px;">
                    E-Mail: ${participant.email} <br>
                    Tel: ${participant.phone} | Zustieg: ${participant.boarding}
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

export const getTripConfirmationMailText = (values: TripRegisterFormValue): string => {
    const [contactPerson, ...additionalParticipants] = values.participants;

    let totalPrice = 0;
    values.participants.forEach((p) => {
        totalPrice += calculateParticipantPrice(p, values);
    });

    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">
            
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">
                
                <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">
                    Anmeldebestätigung
                </h1>
                <p style="font-size: 16px; font-weight: bold; color: #555;">
                    Ausfahrt: ${values.trip.destination} <br>
                    Datum: ${values.trip.date}
                </p>

                <p>Hallo ${contactPerson.firstName},</p>

                <p>
                    wir freuen uns über eure Anmeldung! Bitte prüfe die folgenden Daten auf Richtigkeit.
                </p>

                <div style="margin-top: 20px;">
                    ${renderParticipant(contactPerson, values, 'Ansprechpartner')}

                    ${
                        additionalParticipants.length > 0
                            ? `
                                <h3 style="margin: 24px 0 16px 0; color: #3f51b5;">Zusatzpersonen</h3>
                                ${additionalParticipants.map((p) => renderParticipant(p, values)).join('')}
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
                    values.additionalText
                        ? `
                            <div style="margin-top: 24px; padding: 12px; border-left: 4px solid #3f51b5; background-color: #f0f2f9;">
                                <strong>Zusatzangaben:</strong><br>
                                ${values.additionalText}
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

                <p style="margin-top: 30px;">Schöne Grüße,<br><strong>Dein Team vom Skiclub Kapfenburg e.V.</strong></p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
            </div>
        </div>
    `;
};
