import { pageLabel } from './presence.service';

describe('pageLabel', () => {
    it('benennt Admin-Bereiche lesbar', () => {
        expect(pageLabel('/registrations/ausfahrten/abc')).toBe('Anmeldungen · Ausfahrt');
        expect(pageLabel('/registrations/ausfahrten')).toBe('Anmeldungen');
        expect(pageLabel('/settings/general')).toBe('Einstellungen');
        expect(pageLabel(undefined)).toBe('unterwegs');
        expect(pageLabel('/foo')).toBe('unterwegs');
    });
});
