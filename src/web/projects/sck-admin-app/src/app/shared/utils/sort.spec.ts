import { sortItems } from './sort';

interface Item {
    name?: string;
    n?: number;
}

describe('sortItems', () => {
    const accessors = { name: (i: Item) => i.name, n: (i: Item) => i.n };

    it('sortiert Text natürlich, leere Werte immer zuletzt (auch absteigend)', () => {
        const items: Item[] = [{ name: 'A10' }, { name: '' }, { name: 'a2' }, { name: 'B' }];
        expect(sortItems(items, 'name', 'asc', accessors).map((i) => i.name)).toEqual(['a2', 'A10', 'B', '']);
        expect(sortItems(items, 'name', 'desc', accessors).map((i) => i.name)).toEqual(['B', 'A10', 'a2', '']);
    });

    it('sortiert Zahlen numerisch; ohne Richtung unverändert', () => {
        const items: Item[] = [{ n: 10 }, { n: 2 }];
        expect(sortItems(items, 'n', 'asc', accessors).map((i) => i.n)).toEqual([2, 10]);
        expect(sortItems(items, 'n', '', accessors)).toBe(items);
    });
});
