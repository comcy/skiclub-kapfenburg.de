/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

export const STATIC_DATA: Tile[] = [
    {
        order: 100,
        behavior: TileBehavior.Click,
        title: 'SCK-Programm',
        date: '',
        subTitle: 'Saison 2023 / 2024',
        image: '../../../../assets/img/cards/flyer_cover.png',
        imageDescription: 'SCK-Programm',
        text: '',
        actions: [TileActions.Download],
        downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhgfAlOJOy4UCi6YEz8g?e=VHLxfJ',
        avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
        expiration: new Date('2024-12-31'),
        status: TileStatus.Open,
        boardings: [],
    },
    {
        order: 100,
        behavior: TileBehavior.Click,
        title: 'Mitgliedsantrag',
        date: '',
        subTitle: '',
        image: 'https://cdn.pixabay.com/photo/2020/11/03/15/32/man-5710164_1280.jpg',
        imageDescription: 'Mitgliedsantrag',
        text: '<h3>JAHRESBEITRÄGE</h3> \r - Kinder: 5€ \r - Erwachsene: 25€ \r - Familien: 40€',
        actions: [TileActions.Download],
        downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhge8dP6xXiAadleW0vw?e=lKCaLA',
        avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
        expiration: new Date('2023-12-31'),
        status: TileStatus.Open,
        boardings: [],
    },
];
