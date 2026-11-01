/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile } from '../domain/tile.js';
import { TRIP_PRICING_SETTING_KEY, TripPricing } from '../domain/settings.js';
import { AgeCategory } from '../domain/trip-registration.js';
import { getParticipationFees, getSetting } from './settings-service.js';

export const getCurrentTripPricing = (): TripPricing => getSetting<TripPricing>(TRIP_PRICING_SETTING_KEY) ?? {};

// tile.tripConfig ist ein ungeprueftes extra_json-Passthrough-Feld (siehe
// domain/tile.ts) - pricing wird hier defensiv rausgezogen, nie vertraut.
const extractTilePricing = (tripConfig: unknown): TripPricing | undefined => {
  if (!tripConfig || typeof tripConfig !== 'object') return undefined;
  const pricing = (tripConfig as { pricing?: unknown }).pricing;
  if (!pricing || typeof pricing !== 'object') return undefined;
  return pricing as TripPricing;
};

// Seit Issue #217 pflegen Admins Preise pro Ausfahrt im Tile-Editor - das
// gilt fuer die tatsaechliche Preisberechnung bei Anmeldung/Preisvorschau/
// Bestaetigungsmail genauso wie fuer die oeffentliche Anzeige (siehe
// sck-app's trip-tiles-api.service.ts, dieselbe Fallback-Semantik). Ohne
// diesen Schritt rechneten Preisvorschau und Bestaetigungsmail weiterhin
// ausschliesslich mit der globalen, kaum gepflegten Preismanagement-
// Einstellung - fuer migrierte Tiles mit eigener Preisangabe (#210) ergab
// das durchgehend 0 EUR, siehe Issue #222.
export const getEffectiveTripPricing = (tile: Pick<Tile, 'tripConfig'>): TripPricing => {
  const ownPricing = extractTilePricing(tile.tripConfig);
  const hasOwnPricing = !!(ownPricing && (ownPricing.busLift || ownPricing.busOnly || ownPricing.addons));
  return hasOwnPricing ? ownPricing! : getCurrentTripPricing();
};

export interface PriceableParticipant {
  busOnly: boolean;
  snowshoes: boolean;
  courseRequested: boolean;
  level?: string;
  ageCategory: AgeCategory;
  isMember: boolean;
  // Organisator/Lehrteam: Pauschalbetrag aus den allgemeinen Einstellungen statt des normalen Preises.
  role?: 'organizer' | 'teachingTeam';
}

// Port of the client-side calculateParticipantPrice (formerly
// src/web/projects/data/mail-templates/trip-confirmation-mail.function.ts,
// now removed - see the plan) - the single remaining implementation, used
// both by the confirmation mail and the /trip-price-preview endpoint.
export const calculateParticipantPrice = (participant: PriceableParticipant, pricing: TripPricing): number => {
  if (participant.role) return getParticipationFees()[participant.role];
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
    else if (level === 'Techniktraining (1/2 Tag)') coursePricing = pricing.addons.technikHalf;
    else if (level === 'Techniktraining (ganzer Tag)') coursePricing = pricing.addons.technikFull;

    if (coursePricing) {
      totalPrice += participant.isMember ? coursePricing.member : coursePricing.nonMember;
    }
  }

  return totalPrice;
};
