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
    description: '<h3>JAHRESBEITRÄGE</h3> \r - Kinder: 5€ \r - Erwachsene: 25€ \r - Familien: 40€',
    actions: [TileActions.Download],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhge8dP6xXiAadleW0vw?e=lKCaLA',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2028-12-31'),
    status: TileStatus.Open,
    boardings: [],
};
