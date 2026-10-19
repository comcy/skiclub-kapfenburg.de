/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { AgeCategory, PriceByMembership } from './trip-base';
import { TripConfig } from './trip-config';

// Issue #198/#224: Ausfahrten "ab 18 Jahre" sollen in der Preistabelle
// keine Jugendliche/Kinder-Zeilen zeigen, unabhaengig davon, ob fuer diese
// Kategorien zufaellig Preise hinterlegt sind (z.B. durch den Zero-Fill
// im Tile-Editor). Gesteuert ueber tripConfig.adultsOnly statt Freitext-
// subTitle-Parsing - siehe #198 fuer die Begruendung.
export const getVisibleAgeCategories = (tripConfig: TripConfig | undefined): AgeCategory[] =>
    tripConfig?.adultsOnly ? ['adult'] : ['adult', 'youthUntil16', 'childUntil6'];

// Echte Einheitspreise (eine Zahl fuer alle sichtbaren Altersgruppen UND
// Mitglieds-/Nicht-Mitglieds-Status, siehe #198) werden als einzelner
// "X € pro Person"-Hinweis statt als volle Tabelle dargestellt - reine
// Anzeige-Vereinfachung, kein eigenes Datenfeld. Gibt den einheitlichen
// Preis zurueck, wenn ALLE uebergebenen Zeilen exakt denselben Wert haben
// (Mitglied === Nicht-Mitglied === alle anderen Zeilen), sonst undefined.
export const getUniformPrice = (rows: PriceByMembership[]): number | undefined => {
    if (rows.length === 0) return undefined;
    const [first, ...rest] = rows;
    const allSame = rest.every((row) => row.member === first.member && row.nonMember === first.nonMember);
    return allSame && first.member === first.nonMember ? first.member : undefined;
};
