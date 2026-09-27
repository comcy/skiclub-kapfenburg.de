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

export const SEPA_CREDITOR_SETTING_KEY = 'sepa-creditor';

// The club's own SEPA creditor identity for direct debit collection -
// admin-only (unlike pricing/mail-templates, the public site never needs
// this). The IBAN here isn't secret - it's the same account already shown
// publicly for course fee transfers - but the Gläubiger-ID and this
// account's role as a collection target are treasurer-only concerns.
export interface SepaCreditorSettings {
  creditorName: string;
  creditorId: string;
  iban: string;
  bic?: string;
}

export const MEMBERSHIP_FEE_SETTING_KEY = 'membership-fee';

// Two fixed tiers - one shared amount per family group, not per family
// member (see sepa-export-service.ts for the grouping logic).
export interface MembershipFeeSettings {
  individual: number;
  family: number;
}
