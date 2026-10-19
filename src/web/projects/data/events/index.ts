/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

// Die Ausfahrten-Events selbst kommen seit Issue #215 ausschliesslich aus
// der sck-api-DB (siehe trip-tiles-api.service.ts) - hier bleiben nur noch
// die zwei Info-Tiles, fuer die es noch keine API-Anbindung gibt.
export * from './2026-11-07.tile';
export * from './schneeschuhverleih.tile';
