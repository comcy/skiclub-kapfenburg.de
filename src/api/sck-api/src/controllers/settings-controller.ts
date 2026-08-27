/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import {
  NOTIFICATION_BCC_SETTING_KEY,
  NotificationBccSetting,
  PriceByMembership,
  SKI_COURSE_PRICING_SETTING_KEY,
  SkiCoursePricing,
  TRIP_PRICING_SETTING_KEY,
  TripPricing,
} from '../domain/settings.js';
import { getSetting, setSetting } from '../services/settings-service.js';

const EMPTY_BCC_SETTING: NotificationBccSetting = { customBccList: [] };

export const getNotificationBccSetting: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(getSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY) ?? EMPTY_BCC_SETTING);
  } catch (error: any) {
    console.error('Fehler beim Laden der Benachrichtigungs-Einstellungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Benachrichtigungs-Einstellungen.' });
  }
};

export const updateNotificationBccSetting: RequestHandler = (req, res) => {
  try {
    const body = req.body as NotificationBccSetting;
    if (!Array.isArray(body.customBccList) || !body.customBccList.every((email) => typeof email === 'string')) {
      res.status(400).json({ error: 'customBccList muss ein Array von Strings sein.' });
      return;
    }
    setSetting<NotificationBccSetting>(NOTIFICATION_BCC_SETTING_KEY, { customBccList: body.customBccList });
    res.status(200).json({ customBccList: body.customBccList });
  } catch (error: any) {
    console.error('Fehler beim Speichern der Benachrichtigungs-Einstellungen:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Benachrichtigungs-Einstellungen.' });
  }
};

const EMPTY_SKI_COURSE_PRICING: SkiCoursePricing = {
  childUntilAge: 16,
  snowboard: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
  alpine: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
};

const isPriceByMembership = (value: unknown): value is PriceByMembership =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as PriceByMembership).member === 'number' &&
  typeof (value as PriceByMembership).nonMember === 'number';

const isSkiCoursePricing = (body: unknown): body is SkiCoursePricing => {
  if (typeof body !== 'object' || body === null) return false;
  const value = body as SkiCoursePricing;
  if (typeof value.childUntilAge !== 'number') return false;
  for (const group of [value.snowboard, value.alpine]) {
    if (typeof group !== 'object' || group === null) return false;
    if (!isPriceByMembership(group.adult) || !isPriceByMembership(group.child)) return false;
  }
  return true;
};

export const getSkiCoursePricingSetting: RequestHandler = (_req, res) => {
  try {
    res
      .status(200)
      .json(getSetting<SkiCoursePricing>(SKI_COURSE_PRICING_SETTING_KEY) ?? EMPTY_SKI_COURSE_PRICING);
  } catch (error: any) {
    console.error('Fehler beim Laden der Ski-Kurs-Preise:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Ski-Kurs-Preise.' });
  }
};

export const updateSkiCoursePricingSetting: RequestHandler = (req, res) => {
  try {
    if (!isSkiCoursePricing(req.body)) {
      res.status(400).json({ error: 'Ungültige Ski-Kurs-Preisstruktur.' });
      return;
    }
    setSetting<SkiCoursePricing>(SKI_COURSE_PRICING_SETTING_KEY, req.body);
    res.status(200).json(req.body);
  } catch (error: any) {
    console.error('Fehler beim Speichern der Ski-Kurs-Preise:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Ski-Kurs-Preise.' });
  }
};

const EMPTY_TRIP_PRICING: TripPricing = {};

const isTripPricing = (body: unknown): body is TripPricing => typeof body === 'object' && body !== null;

export const getTripPricingSetting: RequestHandler = (_req, res) => {
  try {
    res.status(200).json(getSetting<TripPricing>(TRIP_PRICING_SETTING_KEY) ?? EMPTY_TRIP_PRICING);
  } catch (error: any) {
    console.error('Fehler beim Laden der Ausfahrten-Preise:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Ausfahrten-Preise.' });
  }
};

export const updateTripPricingSetting: RequestHandler = (req, res) => {
  try {
    if (!isTripPricing(req.body)) {
      res.status(400).json({ error: 'Ungültige Ausfahrten-Preisstruktur.' });
      return;
    }
    setSetting<TripPricing>(TRIP_PRICING_SETTING_KEY, req.body);
    res.status(200).json(req.body);
  } catch (error: any) {
    console.error('Fehler beim Speichern der Ausfahrten-Preise:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Ausfahrten-Preise.' });
  }
};
