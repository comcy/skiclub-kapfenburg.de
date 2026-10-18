/**
 * @copyright Copyright (c) 2024 Christian Silfang
 */

// The actual confirmation mail (incl. price table) is now rendered/sent
// server-side (see the plan, and sck-api's trip-registration-mail-service.ts
// which ported these exact same DEFAULT_*_HTML strings). These constants
// stay here only because the admin's mail-template-management editor still
// uses them to pre-fill an empty field with the text that's actually live
// (see its withDefaults()) - not for sending anymore.
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

// Client-visible "form submitted" success message - still accurate since
// the server now sends the mail within the same registration request.
export const getTripConfirmationSuccessMessage = (): string => {
    return `Alle Angaben wurden übertragen. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
        Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;
};
