import { tileKindOf } from './tile-enums';

describe('tileKindOf', () => {
    it('info type is info', () => expect(tileKindOf({ type: 'info', actions: ['register'] })).toBe('info'));
    it('event with register is a trip', () =>
        expect(tileKindOf({ type: 'event', actions: ['register'] })).toBe('trip'));
    it('event without register is a plain event', () => {
        expect(tileKindOf({ type: 'event', actions: [] })).toBe('event');
        expect(tileKindOf({ type: 'event' })).toBe('event');
    });
});
