/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT =
    'Ihr habt Zuhause ausgemistet, eure Kinder sind wieder gewachsen oder ihr möchtet einfach schauen, was es so gibt?' +
    '\r\r\r Dann kommt vorbei und beginnt gemeinsam mit uns die neue Wintersaison. \r\r\r Unser erfahrenes Lehrteam wird für euch da sein und steht euch gern mit gutem Rat zur Seite.' +
    '\r\r\r **Ort** \r\r  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Altes Schulhaus in Hülen ' +
    '\r\r\r **Zeiten** \r - 9:30 Uhr bis 11:30 Uhr _Annahme_ \r - 13:00 Uhr bis 14:30 Uhr _Verkauf_ \r - 14:30 Uhr bis 15:00 Uhr _Abholung_';

export const BOARDING_LIST = ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const PARTYAUSFAHRT_SONNENKOPF_TILE: Tile = {
    order: 2,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT AN DEN SONNENKOPF',
    date: '28. Dezember 2023',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: 'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2023-12-28'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
