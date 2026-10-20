import { db } from '../db/connection.js';
import { seedSkiCourseTilesOnce } from '../services/ski-course-tiles-seed.js';
import { deleteTile } from '../services/tiles-service.js';

const skiTitles = (): string[] =>
  (
    db
      .prepare(
        `SELECT title FROM tiles WHERE type = 'course' AND (extra_json IS NULL OR extra_json NOT LIKE '%"course":%') ORDER BY title`,
      )
      .all() as { title: string }[]
  ).map((r) => r.title);

beforeEach(() => {
  db.exec("DELETE FROM tiles; DELETE FROM settings WHERE key = 'ski-course-tiles-seeded';");
});

describe('seedSkiCourseTilesOnce', () => {
  it('legt ohne Ski-Kurs-Tile die vier Stufen an', () => {
    expect(seedSkiCourseTilesOnce()).toBe(4);
    expect(skiTitles()).toEqual(['A1', 'A2', 'F1', 'F2']);
  });

  it('läuft nur einmal - ein gelöschtes Tile kommt nicht wieder', () => {
    seedSkiCourseTilesOnce();
    const a1 = db.prepare("SELECT id FROM tiles WHERE title = 'A1'").get() as { id: string };
    deleteTile(a1.id);
    expect(seedSkiCourseTilesOnce()).toBe(0);
    expect(skiTitles()).toEqual(['A2', 'F1', 'F2']);
  });

  it('Pilates (mit verschachteltem course) zählt nicht als Ski-Kurs-Tile', () => {
    db.prepare("INSERT INTO tiles (id, type, title, extra_json) VALUES ('p1', 'course', 'Pilates', ?)").run(
      JSON.stringify({ course: { name: 'Pilates' } }),
    );
    expect(seedSkiCourseTilesOnce()).toBe(4);
  });

  it('legt nichts an, wenn schon ein Ski-Kurs-Tile existiert', () => {
    db.prepare("INSERT INTO tiles (id, type, title) VALUES ('s1', 'course', 'B7')").run();
    expect(seedSkiCourseTilesOnce()).toBe(0);
    expect(skiTitles()).toEqual(['B7']);
  });
});
