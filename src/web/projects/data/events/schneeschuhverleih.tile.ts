/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { InfoTile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Du willst im Winter nicht auf Wanderungen verzichten und bist auf der Suche nach der geeigneten Ausrüstung für Dein Vorhaben? Dann könnten Schneeschuhe genau das Richtige für Dich sein.

Ab einer Schneehöhe von etwa 40 Zentimetern macht es Sinn und vor allem auch Spaß, mit Schneeschuhen unterwegs zu sein. Denn nun würdest Du mit Wanderschuhen nahezu knietief einsinken und Dich nur noch schwer fortbewegen können.

Wir bieten hierfür die richtige Lösung: Du kannst Schneeschuhe bei uns ausleihen, egal ob du privat oder mit uns auf Tour gehst!

**Kosten**
- 8,00 € Tagessatz
`;

export const SCHNEESCHUHVERLEIH_TILE: InfoTile = {
    id: 'schneeschuhverleih',
    order: 7,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'Schneeschuhverleih',
    date: '',
    subTitle: 'Weitere Angebote',
    image: '../../../../assets/img/schneeschuhe.png',
    imageDescription: 'Schneeschuhverleih',
    description: DESCRIPTION_TEXT,
    details: '',
    expiration: new Date('2027-04-30'),
    status: TileStatus.Open,
};
