/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

export const PROGRAM_TILE: Tile = {
    order: 1,
    behavior: TileBehavior.Click,
    title: 'SCK-Programm',
    date: '',
    subTitle: 'Saison 2023 / 2024',
    image: '../../../../assets/img/cards/flyer_cover.png',
    imageDescription: 'SCK-Programm',
    description: '',
    actions: [TileActions.Download],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhgfAlOJOy4UCi6YEz8g?e=VHLxfJ',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2024-12-31'),
    status: TileStatus.Open,
};
