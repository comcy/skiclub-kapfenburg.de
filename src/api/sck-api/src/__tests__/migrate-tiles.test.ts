import type { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync;

beforeAll(async () => {
  ({ db } = await import('../db/connection.js'));
  await import('../scripts/migrate-tiles.js');
});

describe('migrate-tiles script', () => {
  it('legt die migrierten Tiles inklusive Boarding-Zuordnung in der Datenbank an', () => {
    const count = (db.prepare('SELECT COUNT(*) AS count FROM tiles').get() as { count: number }).count;
    expect(count).toBeGreaterThanOrEqual(15);

    const boardingsCount = (db.prepare('SELECT COUNT(*) AS count FROM boardings').get() as { count: number }).count;
    expect(boardingsCount).toBeGreaterThan(0);

    const sample = db.prepare('SELECT * FROM tiles WHERE id = ?').get('partyausfahrt-sonnenkopf-2025') as {
      title: string;
      image: string;
    };
    expect(sample.title).toBe('PARTYAUSFAHRT AN DEN SONNENKOPF');
    // External image URLs are carried over unchanged, never re-uploaded.
    expect(sample.image).toBe('https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg');

    const assignment = db
      .prepare(
        `SELECT b.name AS name FROM trip_boardings tb
         JOIN boardings b ON b.id = tb.boarding_id
         WHERE tb.tile_id = ?`,
      )
      .all('partyausfahrt-sonnenkopf-2025') as { name: string }[];
    expect(assignment.map((r) => r.name)).toContain('Westhausen Turnhalle (5:15 Uhr)');
  });
});
