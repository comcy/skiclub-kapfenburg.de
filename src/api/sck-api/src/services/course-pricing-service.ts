/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { SKI_COURSE_PRICING_SETTING_KEY, SkiCoursePricing } from '../domain/settings.js';
import { getSetting } from './settings-service.js';

export const getCurrentSkiCoursePricing = (): SkiCoursePricing | undefined =>
  getSetting<SkiCoursePricing>(SKI_COURSE_PRICING_SETTING_KEY);

export interface CoursePriceInput {
  sportType?: string;
  // ISO-Datum (YYYY-MM-DD) - ohne Geburtsdatum ist kein Preis bestimmbar.
  birthday?: string;
  isMember: boolean;
}

const ageOn = (birthday: string, reference: Date): number => {
  const born = new Date(birthday);
  if (isNaN(born.getTime())) return NaN;
  let age = reference.getFullYear() - born.getFullYear();
  const before =
    reference.getMonth() < born.getMonth() ||
    (reference.getMonth() === born.getMonth() && reference.getDate() < born.getDate());
  return before ? age - 1 : age;
};

// Server-seitiges Gegenstueck zu CourseRegistrationFormComponent.getPrice():
// 'Ski Alpin' -> alpine, alles andere ('Snowboard') -> snowboard; Kinderpreis
// bei alter < childUntilAge. undefined = nicht bestimmbar (Angaben fehlen oder
// Preise nicht gepflegt) - die Mail zeigt dann keinen Zahlbetrag.
export const calculateCoursePrice = (
  input: CoursePriceInput,
  pricing: SkiCoursePricing | undefined,
  now: Date = new Date(),
): number | undefined => {
  if (!pricing?.alpine || !pricing.snowboard || !input.sportType || !input.birthday) return undefined;
  const age = ageOn(input.birthday, now);
  if (isNaN(age) || age < 0) return undefined;
  const group = input.sportType === 'Ski Alpin' ? pricing.alpine : pricing.snowboard;
  const bracket = age < pricing.childUntilAge ? group.child : group.adult;
  return input.isMember ? bracket.member : bracket.nonMember;
};
