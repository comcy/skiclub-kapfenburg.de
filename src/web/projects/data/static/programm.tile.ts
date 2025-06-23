/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

export const PROGRAM_TILE: Tile = {
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'SCK-Programm',
    date: '',
    subTitle: 'Saison 2024 / 2025',
    image: '../../../../assets/img/cards/SCK-Programm-2425.png',
    imageDescription: 'SCK-Programm',
    description: '',
    actions: [TileActions.Download],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhguFe6RiXvo_jjiU0eg?e=qdC0Gu',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2025-12-31'),
    status: TileStatus.Open,
};
