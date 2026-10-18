/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

export const PROGRAM_TILE: Tile = {
    id: 'programm',
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'SCK-Programm',
    date: '',
    subTitle: 'Saison 2026 / 2027',
    image: '../../../../assets/img/cards/sck-programm2627.png',
    imageDescription: 'SCK-Programm',
    description: '',
    details: '',
    imageOnly: true,
    actions: [TileActions.Download],
    downloadActionLink: 'https://drive.google.com/file/d/1b3Zk0kSG7z-QPd497djWMNoCx9vDyasJ/view?usp=sharing',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};
