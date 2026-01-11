/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { GymCoursesRegisterFormFields } from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';
import { calculateAge, formatDateByLocale } from 'projects/shared-lib/src/lib/date-time';

export const getGymConfirmationSuccessMessage = (): string => {
    return `Alle Angaben wurden übertragen. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über 
        <a href="mailto:registration@skiclub-kapfenburg.de"><b>registration@skiclub-kapfenburg.de</b></a>.`;
};

export const getGymConfirmationMailSubject = (values: GymCoursesRegisterFormFields): string => {
    return `SC-Kapfenburg Anmeldung: ${values.firstName}`;
};

export const getGymConfirmationMailBcc = (): string => {
    // return 'christian.silfang@gmail.com';
    return 'christian.silfang@gmail.com, m.rup@gmx.de, inchen14794@yahoo.de, registration@skiclub-kapfenburg.de';
};

export const getGymConfirmationMailText = (values: GymCoursesRegisterFormFields): string => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; padding-top: 8px; padding-bottom: 16px;">
            <h1 style="color: #0073e6;">Anmeldung beim Skiclub Kapfenburg e.V. zum Kurs "${values.course.name}" - ${values.course.date}</h1>
            <p>Hallo ${values.firstName},</p>
            
            <p>wir freuen uns, dass dir unser Angebot gefällt, und bestätigen hiermit deine Anmeldung.</p>
            <p>Bitte prüfe die folgenden Daten auf Richtigkeit und beachte unsere nachstehenden Informationen und Teilnahmebedingungen.
                <br>
                <br>
                Solltest du Fehler in deinen Daten entdeckt haben oder sind dir die Teilnahmebedingungen noch nicht ganz klar, melde dich gerne bei uns. Du kannst direkt auf diese E-Mail antworten. Im Falle einer Stornierung verwende bitte ebenfalls diese Mail als Referenz. 
                Wir kümmern uns umgehend um die Änderungen und setzen uns mit dir in Verbindung.</p>

            <p>Wir haben folgende Daten registriert:</p>

            <div style="display: flex; border-left: 4px solid #ac1dee; padding-left: 16px; font-family: Arial, sans-serif;">
                <!-- Linke Spalte -->
                <div style="flex: 1; padding-right: 16px;">
                    <p style="margin: 0; font-weight: bold; font-size: 1.2em; color: #0073e6;">
                        ${values.firstName} ${values.lastName}
                    </p>
                    <p style="margin: 4px 0;">E-Mail: <span style="font-weight: bold; color: #333;">${values.email}</span></p>
                    <p style="margin: 4px 0;">Telefon: <span style="font-weight: bold; color: #333;">${values.phone}</span></p>
                </div>
            
                <!-- Rechte Spalte -->
                <div style="flex: 1; padding-left: 16px;">
                    <p style="margin: 4px 0;">Kurs: <span style="font-weight: bold; color: #333;">${values.course.name} - ${values.course.date}</span></p>
                    <p style="margin: 4px 0;">Geburtstag: <span style="font-weight: bold; color: #333;">${formatDateByLocale(values.birthday)} (${calculateAge(values.birthday)})</span></p>
                    <p style="margin: 4px 0;">Zusatzangaben:</p>
                    <div style="padding: 8px; background-color: #0073e610; border-radius: 4px; border: 1px solid #ddd;">
                        <p style="margin: 0; color: #333; padding-left: 8px;">${values.additionalText}</p>
                    </div>
                </div>
            </div>
            
            
            <div style="background-color: #f7f7f7; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <h2>Aktuelle Teilnahmebedingungen</h2>
                
                <h3>Gültigkeit der Anmeldung, Anzahlung und Stornierung</h3>
                <ul>
                    <li>Die Anmeldung ist erst gültig mit der Bezahlung der Kursgebühren von 40 EUR (Mitglieder) oder 60 EUR (Nicht-Mitglieder).
                        
                        <div style="padding-left: 8px; border-left: 4px solid#ac1dee; margin-top: 16px; margin-bottom: 16px;">
                            <p style="margin: 0; font-weight: bold; font-size: 14px;">Skiclub Kapfenburg e.V.</p>
                            <p style="margin: 0;">BIC: <span style="font-weight: bold;">GENODES1AAV</span></p>
                            <p style="margin: 0;">IBAN: <span style="font-weight: bold;">DE61 6149 0150 0131 4700 00</span></p>
                            <p style="margin: 0;">Verwendungszweck: <em>Kurs + Monat / Jahr</em></p>
                        </div>

                    </li>
                    <li>Anmeldeschluss sowie die Möglichkeit zur Stornierung der Anmeldung besteht bis 14 Tage vor Kursbeginn. Die geleistete Zahlung wird dir in diesem Fall zurück erstattet</li>
                    <li>Bei zu geringer Teilnehmerzahl kann der Kurs ggfs. nicht stattfinden. Die geleistete Zahlung wird dir in diesem Fall selbstverständlich ebenfalls zurück erstattet</li>
                </ul>                   
                
                <p style="color: #e60f00; font-weight: bold;">Bitte bringe deine eigene Gymnastikmatte zum Kurs mit!</p> 
                <p>Weitere Informationen und Bedingungen findest du ebenfalls auf unserer Website unter: <a href="https://www.skiclub-kapfenburg.de/gymnastik/information" style="color: #0073e6; text-decoration: none;">Kursinformation</a>
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
