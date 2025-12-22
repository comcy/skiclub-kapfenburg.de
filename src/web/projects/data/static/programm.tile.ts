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
    subTitle: 'Saison 2025 / 2026',
    image: '../../../../assets/img/cards/sck-programm-2526.png',
    imageDescription: 'SCK-Programm',
    description: '',
    actions: [TileActions.Download],
    downloadActionLink: 'https://1drv.ms/b/c/e16937961b6e725a/IQCn0TUDCXP5QIwb9XeWsjIkAbGbZXbJjH4wYnfRCxHQP98?e=ukyCEo',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2026-12-31'),
    status: TileStatus.Open,
};
