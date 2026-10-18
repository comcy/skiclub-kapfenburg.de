/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TRIP_PRICING_SETTING_KEY, TripPricing } from '../domain/settings.js';
import { AgeCategory } from '../domain/trip-registration.js';
import { getSetting } from './settings-service.js';

export const getCurrentTripPricing = (): TripPricing => getSetting<TripPricing>(TRIP_PRICING_SETTING_KEY) ?? {};

export interface PriceableParticipant {
  busOnly: boolean;
  snowshoes: boolean;
  courseRequested: boolean;
  level?: string;
  ageCategory: AgeCategory;
  isMember: boolean;
}

// Port of the client-side calculateParticipantPrice (formerly
// src/web/projects/data/mail-templates/trip-confirmation-mail.function.ts,
// now removed - see the plan) - the single remaining implementation, used
// both by the confirmation mail and the /trip-price-preview endpoint.
export const calculateParticipantPrice = (participant: PriceableParticipant, pricing: TripPricing): number => {
  let totalPrice = 0;

  // 1. Bus + Lift or Bus Only
  if (participant.busOnly) {
    if (pricing.busOnly) {
      totalPrice += participant.isMember ? pricing.busOnly.member : pricing.busOnly.nonMember;
    }
  } else if (pricing.busLift) {
    const groupPricing = pricing.busLift[participant.ageCategory];
    if (groupPricing) {
      totalPrice += participant.isMember ? groupPricing.member : groupPricing.nonMember;
    }
  }

  // 2. Addons: Snowshoes
  if (participant.snowshoes && pricing.addons?.snowshoes) {
    totalPrice += participant.isMember ? pricing.addons.snowshoes.member : pricing.addons.snowshoes.nonMember;
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
      totalPrice += participant.isMember ? coursePricing.member : coursePricing.nonMember;
    }
  }

  return totalPrice;
};
