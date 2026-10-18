/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { InfoTile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

/**
 * Ski/Snowboard course levels, shown as self-assessment cards on the courses
 * overview page. No individual registration/detail page - all levels are
 * selected via the "Könnerstufe" field on the shared course registration form.
 */
export const COURSE_LEVEL_A1: InfoTile = {
    id: 'level-a1',
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'A1 – Anfänger Basis',
    date: '',
    subTitle: '',
    image: '',
    imageDescription: 'A1 – Anfänger Basis',
    description: `**Dein Stand:** Du stehst zum ersten Mal auf den Brettern oder dem Board (oder es ist schon so ewig her, dass alles wieder weg ist).

**Das lernst du:** Das richtige Gefühl fürs Sportgerät, sicheres Bremsen, Liften und die allerersten Kurven im flachen Gelände.

**Dein Ziel:** Sicher und mit einem guten Gefühl den Anfängerhügel hinunterkommen.`,
    details: '',
    expiration: new Date('2099-12-31'),
    status: TileStatus.Open,
};

export const COURSE_LEVEL_A2: InfoTile = {
    id: 'level-a2',
    order: 2,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'A2 – Anfänger Plus',
    date: '',
    subTitle: '',
    image: '',
    imageDescription: 'A2 – Anfänger Plus',
    description: `**Dein Stand:** Bremsen und einfache Kurven klappen schon ganz gut. Auf flachen, blauen Pisten fühlst du dich bereits recht wohl.

**Das lernst du:** Mehr Sicherheit beim Kurvenfahren, Tempokontrolle und das Festigen der Technik, damit das Ganze flüssiger wird.

**Dein Ziel:** Blaue Pisten entspannt und ohne Verkrampfen meistern.`,
    details: '',
    expiration: new Date('2099-12-31'),
    status: TileStatus.Open,
};

export const COURSE_LEVEL_F1: InfoTile = {
    id: 'level-f1',
    order: 3,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'F1 – Fortgeschritten Basis',
    date: '',
    subTitle: '',
    image: '',
    imageDescription: 'F1 – Fortgeschritten Basis',
    description: `**Dein Stand:** Du fährst sicher auf blauen Pisten. Auch leichtere rote Pisten nimmst du schon in Angriff, merkst aber, dass es noch anstrengend ist.

**Das lernst du:** Paralleles Skifahren bzw. flüssiges Drehen auf dem Board, rhythmisches Kurvenfahren und die richtige Technik für steileres Gelände.

**Dein Ziel:** Kraft schonen und souverän auf allen roten Pisten unterwegs sein.`,
    details: '',
    expiration: new Date('2099-12-31'),
    status: TileStatus.Open,
};

export const COURSE_LEVEL_F2: InfoTile = {
    id: 'level-f2',
    order: 4,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'F2 – Fortgeschritten Plus',
    date: '',
    subTitle: '',
    image: '',
    imageDescription: 'F2 – Fortgeschritten Plus',
    description: `**Dein Stand:** Du bist zügig und sicher unterwegs, auch auf roten Pisten. Jetzt suchst du den Feinschliff für deinen Fahrstil.

**Das lernst du:** Dynamischeres Fahren (Carving-Ansätze), den Umgang mit schwierigeren Pistenverhältnissen (wie Eis oder Sulzschnee) und variables Kurvenfahren.

**Dein Ziel:** Noch mehr Fahrspaß, Eleganz und Sicherheit in jedem normalen Skigebiet-Terrain.`,
    details: '',
    expiration: new Date('2099-12-31'),
    status: TileStatus.Open,
};

export const COURSE_LEVEL_TILES: InfoTile[] = [COURSE_LEVEL_A1, COURSE_LEVEL_A2, COURSE_LEVEL_F1, COURSE_LEVEL_F2];
