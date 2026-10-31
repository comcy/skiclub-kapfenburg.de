import { OccupancyBarComponent } from './occupancy-bar.component';

describe('OccupancyBarComponent', () => {
    const bar = (count: number, capacity?: number) => {
        const c = new OccupancyBarComponent();
        c.count = count;
        c.capacity = capacity;
        return c;
    };

    it('Füllstand: < 70 % ok, ab 70 % warn, ab 90 % full (auch überbucht), ohne Kapazität 0', () => {
        expect(bar(6, 10).level).toBe('ok');
        expect(bar(7, 10).level).toBe('warn');
        expect(bar(8, 10).level).toBe('warn');
        expect(bar(17, 20).level).toBe('warn'); // 85 %
        expect(bar(18, 20).level).toBe('full'); // 90 %
        expect(bar(9, 10).level).toBe('full');
        expect(bar(10, 10).level).toBe('full');
        expect(bar(0, 1).level).toBe('ok');
        expect(bar(14, 10).percent).toBe(100);
        expect(bar(3, undefined).percent).toBe(0);
    });
});
