/**
 * @copyright Copyright (c) 2024 Christian Silfang
 */

// The actual confirmation mail is now rendered/sent server-side (see the
// plan, and sck-api's course-registration-mail-service.ts which ported
// these exact same DEFAULT_*_HTML strings). These constants stay here only
// because the admin's mail-template-management editor still uses them to
// pre-fill an empty field with the text that's actually live (see its
// withDefaults()) - not for sending anymore.
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

// Client-visible "form submitted" success message - still accurate since
// the server now sends the mail within the same registration request.
export const getCourseConfirmationSuccessMessage = (): string => {
    return `Alle Angaben wurden übertragen. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;
};
