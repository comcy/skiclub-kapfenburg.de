/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export const NOTIFICATION_BCC_SETTING_KEY = 'notification-bcc';

export interface NotificationBccSetting {
  customBccList: string[];
}

export const SKI_COURSE_PRICING_SETTING_KEY = 'ski-course-pricing';

export interface PriceByMembership {
  member: number;
  nonMember: number;
}

export interface SkiCoursePricing {
  // Age cutoff between "Kinder" and "Erwachsene" pricing, e.g. 16.
  childUntilAge: number;
  snowboard: { adult: PriceByMembership; child: PriceByMembership };
  alpine: { adult: PriceByMembership; child: PriceByMembership };
}

export const TRIP_PRICING_SETTING_KEY = 'trip-pricing';

// Mirrors trips-lib's TripPricing (AgeCategory-keyed busLift, busOnly,
// course/technik addons) - duplicated rather than cross-imported, same
// convention as ApiPilatesCourseDto in courses-lib.
export interface TripPricing {
  busLift?: {
    adult: PriceByMembership;
    youthUntil16: PriceByMembership;
    childUntil6: PriceByMembership;
  };
  busOnly?: PriceByMembership;
  addons?: {
    snowshoes?: PriceByMembership;
    technikHalf?: PriceByMembership;
    technikFull?: PriceByMembership;
    courseBeginner?: PriceByMembership;
    courseAdvanced?: PriceByMembership;
  };
}

export const MAIL_TEMPLATE_SETTING_KEY = 'mail-templates';

// Editable prose blocks only - price tables, participant rendering and the
// waitlist branch stay in code (mail-templates/*.function.ts). Empty string
// means "not configured yet", the frontend falls back to its built-in
// default text for that field (see DEFAULT_*_HTML in the .function.ts files).
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
