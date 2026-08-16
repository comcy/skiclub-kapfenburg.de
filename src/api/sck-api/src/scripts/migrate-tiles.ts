/**
 * @copyright Copyright (c) 2026 Christian Silfang
 *
 * One-time (but idempotent — safe to re-run) migration of the tiles that
 * used to live as static TS files under src/web/projects/data/{events,static}
 * into the tiles table. External image URLs are carried over unchanged, not
 * re-uploaded (see FEATURE_BRIEF.md). Content below was hand-transcribed
 * from those source files rather than imported at runtime: those files pull
 * in the full Angular/shared-lib dependency graph (decorators, TripConfig,
 * GymCourseInformation, ...) which has no business being loaded into a plain
 * Node script — reading the values once and writing them here is the
 * simplest thing that gets the same data into SQLite.
 *
 * Fields that only exist on the richer sck-app Tile union (tripConfig,
 * details, location, timeData, course, destination, additionalInformation)
 * are intentionally dropped: the admin Tile schema this feature introduces
 * doesn't model them, and they belong to the separate trip-registration /
 * gym-course features. Run via `pnpm --filter sck-api run migrate:tiles`.
 */

import { db } from '../db/connection.js';
import { TileActions, TileBehavior, TileStatus, TileType } from '../domain/tile.js';
import { setTileBoardings } from '../services/tiles-service.js';

interface MigratedTile {
  id: string;
  order: number;
  type: TileType;
  behavior: TileBehavior;
  title: string;
  date: string;
  subTitle: string;
  image: string;
  imageDescription: string;
  description: string;
  actions: TileActions[];
  downloadActionLink?: string;
  avatar?: string;
  expiration: string;
  status: TileStatus;
  boardings?: string[];
}

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/3502336?v=4';

const TILES: MigratedTile[] = [
  {
    id: 'freie-pistenausfahrt-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: '2-TAGES "FREIE PISTEN" AUSFAHRT"',
    date: '16. bis 17. März 2026',
    subTitle: 'Ab 18 Jahren',
    image: '../../../../assets/img/cards/ski.jpg',
    imageDescription: 'sample',
    description: `
Eine Ausfahrt für alle, die unter der Woche Zeit haben und freie Pisten lieben.
Zusammen mit dem Freizeitclub La-Oele geht es nach Montafon ins Skigebiet „Silvretta“ mit Übernachtung im Hotel Lifestyle/Bludenz.
Das Skigebiet bietet über 140 Pistenkilometer für Skifahrer und Snowboarder aller Levels.
Mit modernen Liftanlagen und einer beeindruckenden Alpenlandschaft ist es ein beliebtes Ziel für Wintersportler.
Neben Skifahren kann man auch Rodeln und Winterwandern genießen. Die gemütichen Hütten laden zum Entspannen ein.

**Ziel**
- Montafon "Silvretta"

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene:                |   260,00 €*  |

---

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-03-17').toISOString(),
    boardings: ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'],
    status: TileStatus.Open,
  },
  {
    id: 'partyausfahrt-sonnenkopf-2025',
    order: 3,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT AN DEN SONNENKOPF',
    date: '28. Dezember 2025',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: 'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    description: `Gemeinsam mit euch wollen wir die Pisten auf über 2000m Höhe unsicher machen.
Es gibt hier familienfreundliche Abfahrten bei tollem Panorama, aber auch herausfordernde, steile Pisten wie die „Bäraloch-Piste“.

Das Skigebiet Sonnenkopf liegt am Fuße des Arlbergs und gilt als sehr schneesicher.
Ihr könnt euch daher auf den Pisten austoben oder auch unsere Schneeschuhe für eine tolle Wanderung ausleihen.

Nach einem erfolgreichen Schneetag lassen wir den Tag in der „KELO-Bar“ ausklingen und stoßen dort miteinander an

**Abfahrtszeiten**
- 05:00 Uhr Schwabsberg
- 05:15 Uhr Westhausen Turnhalle

**Rückfahrt**
- 19:00 Uhr

**Kosten**
- Bus + Liftkarte + kl. Vesper: 100,00 €
- Schneeschuhverleih: 5,00 €
`,
    actions: [TileActions.Register],
    expiration: new Date('2025-12-28').toISOString(),
    boardings: ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'],
    status: TileStatus.BookedUp,
  },
  {
    id: 'trainingstag-oberjoch-2026',
    order: 4,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TRAININGSTAG IN OBERJOCH',
    date: '10. Januar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/piste2.jpg',
    imageDescription: 'sample',
    description: `Diese Ausfahrt eignet sich sowohl für reine Anfänger als auch für Fortgeschrittene.
Egal ob ihr das erste Mal auf Skiern oder dem Board steht oder einfach eure Technik
verbessern wollt – hier seid ihr richtig!
Unser erfahrenes Lehrteam trainiert mit euch auf der Piste und bei Bedarf gerne im
Funpark.
In dieser Saison fahrne wir mit euch in das „familienfreundlichste Skigebiet in den
Alpen“. Dort gibt es über 30km traumhafte Pisten auf fast 1600m Höhe. Für alle, die
sich im Funpark austoben möchten, bietet der „Easypark“ die perfekte Gelegenheit
dazu. Bei guter Schneelage ist eine Langlaufloipe vorhanden.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   75,00 €    |  85,00 €          |
|  Jugendliche bis 16 Jahre   |   65,00 €    |  75,00 €          |
|  Kinder bis 6 Jahre         |   50,00 €    |  55,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Anfängerkurse              |   35,00 €    |  40,00 €          |
|  Techniktraining 1/2 Tag    |   35,00 €    |  30,00 €          |
|  Techniktraining            |   60,00 €    |  55,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

_Hinweis: Kurse ab 5 Jahre möglich_
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-01-11').toISOString(),
    boardings: ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)', 'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)'],
    status: TileStatus.BookedUp,
  },
  {
    id: 'la-oele-ausfahrt-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'LA OELE 2-TAGES SKIAUSFAHRT INS BRANDNERTAL',
    date: '17. bis 18. Januar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/snowboarding.jpg',
    imageDescription: 'sample',
    description: `Bei unser diesjährigen Kooperationsausfahrt mit dem Freizeitclub La-Oele geht es wieder nach Vorarlberg ins Skigebiet Golm mit Übernachtung im Hotel „Weisses Kreuz“ in Feldkirch.

**Ziel**
 - Brandnertal

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene                 |   245,00 €*  |
|  Jugendliche bis 16 Jahre   |   180,00 €*  |
|  Kinder bis 6 Jahre         |   85,00 €*   |

---

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-01-18').toISOString(),
    boardings: ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'],
    status: TileStatus.Open,
  },
  {
    id: 'tagesausfahrt-ehrwald-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH EHRWALD',
    date: '31. Januar 2026',
    subTitle: 'Familienfreundlich',
    image: '../../../../assets/img/cards/huette.jpg',
    imageDescription: 'sample',
    description: `Auch in dieser Saison darf unser Klassiker, die Ausfahrt nach Ehrwald, nicht fehlen.
Dieses Gebiet verfügt über wunderschöne, leichte bis mittelschwere Waldpisten.
Besonders Familien finden hier traumhafte Bedingungen vor. Für jeden ist etwas dabei - seien es die breiten Pisten, der Funpark oder die Funslope mit Wellen, Tunneln und
Schneeschnecke.

Falls ihr doch lieber die Gegend zu Fuß erkundet, könnt ihr direkt an der Ehrwalder
Almbahn loslegen: Von dort aus starten zwei schöne Winterwanderwege und Schneeschuhtrails

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   90,00 €    |  100,00 €          |
|  Jugendliche bis 16 Jahre   |   65,00 €    |  75,00 €          |
|  Kinder bis 6 Jahre         |   50,00 €    |  55,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Anfängerkurse              |   35,00 €    |  40,00 €          |
|  Techniktraining 1/2 Tag    |   35,00 €    |  40,00 €          |
|  Techniktraining            |   60,00 €    |  65,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-01').toISOString(),
    boardings: ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)', 'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)'],
    status: TileStatus.BookedUp,
  },
  {
    id: 'freitagsausfahrt-ehrwald-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'FREITAGSAUSFAHRT NACH EHRWALD',
    date: '6. Februar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/skis.jpg',
    imageDescription: 'sample',
    description: `Wie könnte das Wochenende besser beginnen als mit Skifahren/Snowboarden?
Getreu nach diesem Motto fahren wir am Freitag zur Ehrwalder Almbahn und genießen die tolle Landschaft mit leeren Pisten.
Zum Abschluss lassen wir den Tag beim Après Ski in der Brent Alm an der Talstation ausklingen.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg
 - 05:40 Uhr Ebnat Jurahalle

**Rückfahrt**
 - 18:00 Uhr bis 18:30 Uhr

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   85,00 €    |  95,00 €          |
|                             |              |                   |
|                             |              |                   |
|  Schneeschuhe               |    5,00 €    |   5,00 €          |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-07').toISOString(),
    boardings: [
      'Westhausen Turnhalle (5:15 Uhr)',
      'Lauchheim Schule (5:25 Uhr)',
      'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
      'Ebnat Jurahalle (5:40 Uhr)',
    ],
    status: TileStatus.Open,
  },
  {
    id: 'partyausfahrt-lermoos-2026',
    order: 6,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT NACH LERMOOS',
    date: '21. Februar 2026',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: '../../../../assets/img/cards/lift.jpg',
    imageDescription: 'sample',
    description: `Kommt mit uns in die Tiroler Zugspitz-Arena nach Lermoos. Im Skigebiet Grubigstein steht auf 1000 - 2100m Höhe wintersportlicher Spaß auf dem Programm. Zwölf
Abfahrten bringen Abwechslung. Auch für das leibliche Wohl ist gesorgt: Zahlreiche
Hütten bieten Gelegenheit zum Einkehrschwung.
Den Schneetag lassen wir ausklingen beim Aprés Ski in der „Lahmen Ente“ direkt
an der Talstation. Hierfür ist genügend Zeit eingeplant, denn es geht erst um 19 Uhr
zurück Richtung Heimat.

 **Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule
 - 05:15 Uhr Westhausen Turnhalle
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Rückfahrt**
- 19:00 Uhr

**Kosten**

|                                 |               |
|:--------------------------------|--------------:|
|  Bus + Liftkarte + kl. Vesper   |   95,00 €     |
|  Schneeschuhe                   |    5,00 €     |
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-22').toISOString(),
    boardings: [
      'Schwabsberg Schule (5:00 Uhr)',
      'Westhausen Turnhalle (5:15 Uhr)',
      'Lauchheim Schule (5:25 Uhr)',
      'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
    ],
    status: TileStatus.BookedUp,
  },
  {
    id: 'tagesausfahrt-mellau-damuels-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH MELLAU-DAMÜLS',
    date: '28. Februar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/snow.jpg',
    imageDescription: 'sample',
    description: `Bei dieser Ausfahrt geht es in das Traumskigebiet Mellau-Damüls. Dieses befindet
sich mitten im Bregenzerwald und ist das größte Gebiet in der Region. Es bietet über
100km schneesichere Pisten.
Neben den vielen Pisten von leicht bis sehr anspruchsvoll kommen die
Genussfahrer, Schneekids, Freestyler und Freerider voll auf ihre Kosten.
Tobt euch aus auf den bestens präparierten Pisten, im Snowpark, auf der SpeedStrecke, im Skitunnel oder auf der Skiroute.
Auch für Anfänger ist diese Ausfahrt bestens geeignet: Ihr müsst nicht am Übungslift
an der Talstation bleiben, denn im Mellauer Teil des Gebietes gibt es viele einfachere
Pisten, die gut zu bewältigen sind.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   90,00 €    |  100,00 €          |
|  Jugendliche bis 16 Jahre   |   80,00 €    |  90,00 €          |
|  Kinder bis 6 Jahre         |   65,00 €    |  70,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Techniktraining 1/2 Tag    |   25,00 €    |  30,00 €          |
|  Techniktraining            |   50,00 €    |  55,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

_Hinweis: Keine Anfänger_
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-29').toISOString(),
    boardings: ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)', 'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)'],
    status: TileStatus.BookedUp,
  },
  {
    id: 'montagsausfahrt-fellhorn-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT FELLHORN',
    date: '09. März 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/skiing.jpg',
    imageDescription: 'sample',
    description: `An unserer Montagsausfahrt geht es traditionell nach Oberstdorf zum Skigebiet Fellhorn/Kanzelwand. Hier erwartet euch ein abwechslungsreiches Skigebiet mit 36 bestens präparierten Pisten für jedes Level.
Das Gebiet verfügt über eine der modernsten Beschneiungsanlagen in Deutschland, womit dem Schneevergnügen nichts mehr im Wege steht.

Nach einem tollen Schneetag lassen wir den Tag mit Kaffee und Kuchen am Bus oder an der Aprés Ski Bar ausklingen.

_Hinweis: Keine Anfänger_
`,
    actions: [TileActions.Register],
    expiration: new Date('2026-03-10').toISOString(),
    boardings: ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)', 'Hülen Bushaltestelle (5:30 Uhr)'],
    status: TileStatus.Open,
  },
  {
    id: 'skiboerse-2026',
    order: 2,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'Skibörse',
    date: '08. November 2026',
    subTitle: 'Altes Schulhaus Hülen',
    image: '../../../../assets/img/cards/skiboers.jpg',
    imageDescription: 'sample',
    description: `Ihr habt Zuhause ausgemistet, eure Kinder sind wieder gewachsen oder ihr möchtet einfach schauen, was es so gibt?
Dann kommt vorbei und beginnt gemeinsam mit uns die neue Wintersaison.

Unser erfahrenes Lehrteam wird für euch da sein und steht euch gern mit gutem Rat zur Seite.`,
    actions: [],
    avatar: GITHUB_AVATAR,
    expiration: new Date('2026-11-10').toISOString(),
    status: TileStatus.Open,
  },
  {
    id: 'programm',
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
    avatar: GITHUB_AVATAR,
    expiration: new Date('2026-12-31').toISOString(),
    status: TileStatus.Open,
  },
  {
    id: 'memebership',
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
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhge8cEZzZ36UQ89Ixaw?e=XsGgvZ',
    avatar: GITHUB_AVATAR,
    expiration: new Date('2028-12-31').toISOString(),
    status: TileStatus.Open,
    boardings: [],
  },
  {
    id: 'overview',
    order: 3,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'Themenübersicht',
    date: '',
    subTitle: 'Saison 2023 / 2024',
    image: '../../../../assets/img/cards/overview_2324.png',
    imageDescription: 'Themenübersicht',
    description: '',
    actions: [TileActions.Download, TileActions.Share],
    downloadActionLink: 'https://1drv.ms/b/s!AlpybhuWN2nhgfBbPVscUktQZMLNPQ?e=4HybnO',
    avatar: GITHUB_AVATAR,
    expiration: new Date('2024-12-31').toISOString(),
    status: TileStatus.Open,
  },
  {
    id: 'skilift-info',
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'Kein Betrieb',
    date: 'SKILIFT KAPFENBURG GEÖFFNET',
    subTitle: 'ab 05. Februar 2026 geschlossen',
    image: '../../../../assets/img/cards/skilift_nacht.jpeg',
    imageDescription: 'Skilift',
    description: 'Der Skilift an der Kapfenburg ist geschlossen.',
    actions: [],
    avatar: GITHUB_AVATAR,
    expiration: new Date('2026-03-31').toISOString(),
    status: TileStatus.Open,
  },
  {
    id: 'pilates-thu',
    order: 2,
    type: TileType.Course,
    behavior: TileBehavior.View,
    title: 'Pilates (Donnerstags)',
    date: '24.09.2026 bis (einschl.) 17.12.2026',
    subTitle: 'Donnerstags, 18:00 Uhr - 19:00 Uhr (Altes Schulhaus Hülen)',
    image: '../../../../assets/img/pilates/2026_07-03_thursday.png',
    imageDescription: 'pilates',
    description: `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.
`,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31').toISOString(),
    status: TileStatus.Open,
  },
  {
    id: 'pilates-wed',
    order: 2,
    type: TileType.Course,
    behavior: TileBehavior.View,
    title: 'Pilates (Mittwochs)',
    date: '23.09.2026 bis (einschl.) 16.12.2026',
    subTitle: 'Mittwochs, 8:30 Uhr - 09:30 Uhr (Altes Schulhaus Hülen)',
    image: '../../../../assets/img/pilates/2026_07-03_wednesday.png',
    imageDescription: 'pilates',
    description: `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.
`,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31').toISOString(),
    status: TileStatus.Open,
  },
];

const upsertTile = (tile: MigratedTile): void => {
  db.prepare(
    `INSERT INTO tiles (
      id, order_index, type, title, date, sub_title, image, image_description,
      description, status, expiration, behavior, actions, download_action_link, avatar, visible
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      order_index = excluded.order_index,
      type = excluded.type,
      title = excluded.title,
      date = excluded.date,
      sub_title = excluded.sub_title,
      image = excluded.image,
      image_description = excluded.image_description,
      description = excluded.description,
      status = excluded.status,
      expiration = excluded.expiration,
      behavior = excluded.behavior,
      actions = excluded.actions,
      download_action_link = excluded.download_action_link,
      avatar = excluded.avatar,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
  ).run(
    tile.id,
    tile.order,
    tile.type,
    tile.title,
    tile.date,
    tile.subTitle,
    tile.image,
    tile.imageDescription,
    tile.description,
    tile.status,
    tile.expiration,
    tile.behavior,
    JSON.stringify(tile.actions),
    tile.downloadActionLink ?? null,
    tile.avatar ?? null,
  );

  if (tile.boardings) {
    for (const name of tile.boardings) {
      db.prepare('INSERT OR IGNORE INTO boardings (id, name) VALUES (lower(hex(randomblob(16))), ?)').run(name);
    }
    setTileBoardings(tile.id, tile.boardings);
  }
};

let migrated = 0;
for (const tile of TILES) {
  upsertTile(tile);
  migrated += 1;
}

console.log(`Migriert: ${migrated} Tiles.`);
