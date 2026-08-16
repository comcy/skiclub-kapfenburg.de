/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { formatDateByLocale } from 'projects/shared-lib/src/lib/date-time';
import {
    FamilyMember,
    MembershipRegisterFormValue,
} from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';

export const getMembershipConfirmationSuccessMessage = (): string => {
    return `Dein Mitgliedsantrag wurde übermittelt. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;
};

export const getMembershipConfirmationMailSubject = (values: MembershipRegisterFormValue): string => {
    return `SC-Kapfenburg Mitgliedsantrag: ${values.firstName} ${values.lastName}`;
};

export const getMembershipNotificationMailSubject = (values: MembershipRegisterFormValue): string => {
    return `Neuer Mitgliedsantrag: ${values.firstName} ${values.lastName}`;
};

// Fixed recipient list for the board / treasurer notification - analog to getTripConfirmationMailBcc.
export const getMembershipNotificationMailRecipients = (): string => {
    return 'christian.silfang@gmail.com,m.rup@gmx.de,registration@skiclub-kapfenburg.de';
};

const renderFamilyMember = (member: FamilyMember): string => {
    return `
    <tr>
        <td style="padding: 4px 0;">${member.firstName} ${member.lastName}</td>
        <td style="padding: 4px 0; text-align: right; color: #666;">${formatDateByLocale(member.birthday)}</td>
    </tr>
    `;
};

export const getMembershipConfirmationMailText = (values: MembershipRegisterFormValue): string => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">

                <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">Antragsbestätigung Mitgliedschaft</h1>

                <p>Hallo ${values.firstName},</p>
                <p>
                    wir freuen uns über deinen Mitgliedsantrag beim Skiclub Kapfenburg e.V.! Bitte prüfe die folgenden
                    Daten auf Richtigkeit.
                </p>

                <div style="margin-top: 20px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <p style="margin: 4px 0;"><strong>${values.firstName} ${values.lastName}</strong></p>
                    <p style="margin: 4px 0;">Geburtstag: ${formatDateByLocale(values.birthday)}</p>
                    <p style="margin: 4px 0;">Adresse: ${values.address}</p>
                    <p style="margin: 4px 0;">E-Mail: ${values.email}</p>
                    <p style="margin: 4px 0;">Telefon: ${values.phone}</p>
                </div>

                ${
                    values.isFamilyMembership && values.familyMembers.length > 0
                        ? `
                        <div style="margin-top: 16px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; color: #3f51b5;">Familienmitgliedschaft</p>
                            <table style="width: 100%;">
                                ${values.familyMembers.map(renderFamilyMember).join('')}
                            </table>
                        </div>
                        `
                        : ''
                }

                <div style="margin-top: 16px; padding: 16px; background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #3f51b5;">SEPA-Lastschriftmandat</p>
                    <p style="margin: 4px 0;">IBAN: ${values.iban}</p>
                    <p style="margin: 4px 0;">
                        Du hast das Lastschriftmandat für den Einzug deines Mitgliedsbeitrags erteilt.
                    </p>
                </div>

                <p style="margin-top: 24px;">
                    Deine Mitgliedschaft wird nach Prüfung durch den Vorstand bestätigt. Die SEPA-Mandatsverarbeitung
                    erfolgt anschließend durch unseren Kassenwart.
                </p>

                <p style="margin-top: 30px;">Schöne Grüße,<br><strong>Dein Team vom Skiclub Kapfenburg e.V.</strong></p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
            </div>
        </div>
    `;
};

// Board/treasurer notification - intentionally omits the IBAN, only non-sensitive key data.
export const getMembershipNotificationMailText = (values: MembershipRegisterFormValue): string => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #dddddd;">

                <h1 style="color: #3f51b5; font-size: 22px; margin-top: 0;">Neuer Mitgliedsantrag eingegangen</h1>

                <div style="margin-top: 20px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <p style="margin: 4px 0;"><strong>${values.firstName} ${values.lastName}</strong></p>
                    <p style="margin: 4px 0;">Geburtstag: ${formatDateByLocale(values.birthday)}</p>
                    <p style="margin: 4px 0;">Adresse: ${values.address}</p>
                    <p style="margin: 4px 0;">E-Mail: ${values.email}</p>
                    <p style="margin: 4px 0;">Telefon: ${values.phone}</p>
                    <p style="margin: 4px 0;">
                        Familienmitgliedschaft: ${values.isFamilyMembership ? `Ja (${values.familyMembers.length} weitere Person(en))` : 'Nein'}
                    </p>
                    <p style="margin: 4px 0;">SEPA-Lastschriftmandat erteilt: Ja</p>
                </div>

                <p style="margin-top: 24px;">
                    Die vollständigen Antragsdaten inkl. IBAN stehen im Mitgliederverwaltungssystem zur Prüfung
                    bereit. Aus Sicherheitsgründen ist die IBAN nicht Teil dieser E-Mail.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Diese E-Mail wurde automatisch erstellt.</p>
            </div>
        </div>
    `;
};
