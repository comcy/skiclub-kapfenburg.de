/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

// Die Ausfahrten-Events selbst kommen seit Issue #215 ausschliesslich aus
// der sck-api-DB (siehe trip-tiles-api.service.ts) - hier bleiben nur noch
// der Schneeschuhverleih als Info-Tile ohne API-Anbindung. Die Skiboerse ist
// seit Issue #271-Folge ein normaler Event ohne Anmeldung im Admin.
export * from './schneeschuhverleih.tile';
