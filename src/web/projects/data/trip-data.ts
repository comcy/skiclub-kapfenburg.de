import {
  Tile,
  TileActions,
  TileBehavior,
  TileStatus,
} from 'projects/shared-lib/src/lib/models';

export const BOARDING_LIST = [
  'Westhausen Turnhalle (5:40 Uhr)',
  'Lauchheim Schule (5:50 Uhr)',
  'Hülen (6:00 Uhr)',
  'Ebnater Tennishalle (6:10 Uhr)',
];

export const BOARDING_LIST_SHORT = [
  'Schwabsberg Schule (5:00 Uhr)',
  'Westhausen Turnhalle (5:15 Uhr)',
];

export const TRIP_DATA: Tile[] = [
  {
    order: 0,
    behavior: TileBehavior.Click,
    title: 'SCK-Programm',
    date: '',
    subTitle: 'Saison 2022 / 2023',
    image: '../../../../assets/img/cards/flyer_cover.png',
    imageDescription: 'sample',
    text: '',
    actions: [],
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2023-12-31'),
    status: TileStatus.Open,
    boardings: [],
  },
  {
    order: 1,
    behavior: TileBehavior.View,
    title: 'Skibörse',
    date: '05. November 2022',
    subTitle: 'Altes Schulhaus Hülen',
    image: '../../../../assets/img/cards/skiboers.jpg',
    imageDescription: 'sample',
    text: '##Zeiten \r - **9:30 Uhr bis 11:30 Uhr Annahme** \r - **13:00 Uhr bis 14:30 Uhr Verkauf** \r - **14:30 Uhr bis 15:00 Uhr Abholung**',
    actions: [],
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2022-05-11'),
    status: TileStatus.Open,
    boardings: [],
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: 'JUGEND- UND FAMILIEN-SKIFREIZEIT MIT LA-OELE',
    date: '27. -30. Dezember 2022',
    subTitle: '4 Tage',
    image:
      'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    text: 'Ziel **ist** das Oberallgäu mit Übernachtung im Jugendhaus „Elias“. Mit dem Hörnerskipass geht es in die Skigebiete Ofterschwang, Bolsterlang, Balderschwang und Grasgehren.',
    actions: [TileActions.Register],
    expiration: new Date('2022-12-27'),
    boardings: BOARDING_LIST_SHORT,
    status: TileStatus.Canceled,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: 'SKI & SNOWBOARD KURSAUSFAHRT NACH JUNGHOLZ',
    date: '15. Januar 2023',
    subTitle: 'Tagesausfahrt',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/15/40/boy-1835416_960_720.jpg',
    imageDescription: 'sample',
    text: 'Für tolles Kursambiente sorgt das Snow Learnland und N‘Ice Bear Kinderland.',
    actions: [TileActions.Register],
    expiration: new Date('2023-01-15'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: 'LA-OELE 2-TAGES SKIAUSFAHRT',
    date: '21. - 22. Januar 2023',
    subTitle: '2 Tage',
    image:
      'https://cdn.pixabay.com/photo/2020/01/13/23/15/snowboarding-4763731_960_720.jpg',
    imageDescription: 'sample',
    text: 'Übernachtung im „Hotel Löwen“ in Feldkirch mit Halbpension, 2-Tages Skipass und Busfahrt ins Skigebiet „Vorarlberg - Sonnenkopf“',
    actions: [TileActions.Register],
    expiration: new Date('2023-01-21'),
    boardings: BOARDING_LIST_SHORT,
    status: TileStatus.Open,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH EHRWALD',
    date: '04. Februar 2023',
    subTitle: 'Tagesausfahrt',
    image:
      'https://cdn.pixabay.com/photo/2016/12/30/00/00/snow-park-1939642_960_720.jpg',
    imageDescription: 'sample',
    text: 'Ein Skigebiet mit 27,5 km bestens präparierten und beschneiten Pisten. Außerdem beliebt bei Freeskiern und Boardern ist der Snowpark „Betterpark“.',
    actions: [TileActions.Register],
    expiration: new Date('2023-02-04'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: '15H-PARTYAUSFAHRT NACH LERMOOS, Ü18',
    date: '25. Februar 2023',
    subTitle: 'Tagesausfahrt',
    image:
      'https://cdn.pixabay.com/photo/2018/03/05/15/45/ski-3201017_960_720.jpg',
    imageDescription: 'sample',
    text: 'Mit 40 Pistenkilometer bietet Lermoos sowohl für Skifahrer, als auch für Snowboarder ein vielfältiges Angebot inkl. Apres Ski \r **Rückfahrt 19:00 Uhr**',
    actions: [TileActions.Register],
    expiration: new Date('2023-02-25'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT ANS FELLHORN',
    date: '06. März 2023',
    subTitle: 'Tagesausfahrt',
    image:
      'https://cdn.pixabay.com/photo/2014/12/31/02/59/skis-584600_960_720.jpg',
    imageDescription: 'sample',
    text: 'Inklusive Kaffee und Kuchen am Bus',
    actions: [TileActions.Register],
    expiration: new Date('2023-03-06'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
  },
  {
    order: 2,
    behavior: TileBehavior.View,
    title: '2-TAGE „FREIE PISTENAUSFAHRT“ INS PITZTAL / HOCHZEIGER',
    date: '20. - 21. März 2023',
    subTitle: '2 Tage',
    image:
      'https://cdn.pixabay.com/photo/2012/12/21/07/20/skiing-71473_960_720.jpg',
    imageDescription: 'sample',
    text: 'Eine Ausfahrt für Alle die unter der Woche Zeit haben und „freie Pisten“ lieben!',
    actions: [TileActions.Register],
    expiration: new Date('2023-03-20'),
    boardings: BOARDING_LIST_SHORT,
    status: TileStatus.Open,
  },
];
