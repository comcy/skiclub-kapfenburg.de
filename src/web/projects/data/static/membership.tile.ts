/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

export const MEMBERSHIP_TILE: Tile = {
    order: 5,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'Mitgliedsantrag',
    date: '',
    subTitle: '',
    image: 'https://cdn.pixabay.com/photo/2020/11/03/15/32/man-5710164_1280.jpg',
    imageDescription: 'Mitgliedsantrag',
    description: '<h3>JAHRESBEITRÄGE</h3> \n\r - Kinder: 5€ \n\r - Erwachsene: 25€ \n\r - Familien: 40€',
    actions: [TileActions.Download],
    downloadActionLink: 'assets/downloads/Mitgliedsantrag_SCK.pdf',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2028-12-31'),
    status: TileStatus.Open,
    boardings: [],
};
