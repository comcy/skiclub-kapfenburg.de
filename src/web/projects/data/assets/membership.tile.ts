/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

export const MEMBERSHIP_TILE: Tile = {
    id: '98caad3a-b2aa-40da-a6d2-a14a5c75ee76',
    order: 5,
    behavior: TileBehavior.Click,
    title: 'Mitgliedsantrag',
    date: '',
    subTitle: '',
    image: 'https://cdn.pixabay.com/photo/2020/11/03/15/32/man-5710164_1280.jpg',
    imageDescription: 'Mitgliedsantrag',
    description: '<h3>JAHRESBEITRÄGE</h3> \r - Kinder: 5€ \r - Erwachsene: 25€ \r - Familien: 40€',
    actions: [TileActions.Download],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhge8dP6xXiAadleW0vw?e=lKCaLA',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2023-12-31'),
    status: TileStatus.Open,
    boardings: [],
};
