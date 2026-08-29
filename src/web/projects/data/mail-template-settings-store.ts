/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Plain module-level cache, not an Angular service - same reasoning as
// notification-settings-store.ts: the mail-template functions in
// mail-templates/*.ts are pure functions without DI access.
// Populated once (AppComponent.ngOnInit fetches GET /settings/mail-templates)
// and read synchronously by getXConfirmationMailText() as an override on top
// of each template's hardcoded DEFAULT_*_HTML text.
export interface MailTemplateText {
    introHtml: string;
    termsHtml: string;
    signatureHtml: string;
}

export interface TripMailTemplateText extends MailTemplateText {
    waitlistHtml: string;
}

export interface MailTemplateSettings {
    course: MailTemplateText;
    trip: TripMailTemplateText;
    gym: MailTemplateText;
}

let cachedMailTemplateSettings: MailTemplateSettings | undefined;

export const setMailTemplateSettings = (settings: MailTemplateSettings): void => {
    cachedMailTemplateSettings = settings;
};

export const getMailTemplateSettings = (): MailTemplateSettings | undefined => cachedMailTemplateSettings;
