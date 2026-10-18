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
