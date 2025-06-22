/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

export const OVERVIEW_TILE: Tile = {
    order: 3,
    behavior: TileBehavior.Click,
    title: 'Themenübersicht',
    date: '',
    subTitle: 'Saison 2023 / 2024',
    image: '../../../../assets/img/cards/overview_2324.png',
    imageDescription: 'Themenübersicht',
    description: '',
    actions: [TileActions.Download, TileActions.Share],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhgfBbPVscUktQZMLNPQ?e=4HybnO',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2024-12-31'),
    status: TileStatus.Open,
};
