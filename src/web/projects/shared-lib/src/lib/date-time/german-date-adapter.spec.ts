/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TestBed } from '@angular/core/testing';
import { GermanDateAdapter } from './german-date-adapter';

describe('GermanDateAdapter', () => {
    // NativeDateAdapter's constructor calls inject(MAT_DATE_LOCALE) itself -
    // `new GermanDateAdapter()` outside an injection context throws NG0203,
    // so build it the same way Angular's DI would (TestBed.inject after
    // providing it, inside beforeEach - not at describe-body scope, which
    // runs before TestBed's environment is guaranteed initialized).
    let adapter: GermanDateAdapter;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [GermanDateAdapter] });
        adapter = TestBed.inject(GermanDateAdapter);
    });

    it('parses a padded DD.MM.YYYY date as day-month-year, not month-day-year', () => {
        // Date.parse('10.03.2018') misreads this as 3 October - the exact
        // bug this adapter exists to fix.
        const date = adapter.parse('10.03.2018');
        expect(date?.getFullYear()).toBe(2018);
        expect(date?.getMonth()).toBe(2); // March, 0-indexed
        expect(date?.getDate()).toBe(10);
    });

    it('parses a date whose day has no valid month equivalent (native Date.parse fails on this)', () => {
        const date = adapter.parse('15.05.1985');
        expect(date?.getFullYear()).toBe(1985);
        expect(date?.getMonth()).toBe(4); // May
        expect(date?.getDate()).toBe(15);
    });

    it('accepts unpadded single-digit day/month', () => {
        const date = adapter.parse('1.1.2015');
        expect(date?.getFullYear()).toBe(2015);
        expect(date?.getMonth()).toBe(0);
        expect(date?.getDate()).toBe(1);
    });

    it('rejects a calendar date that does not exist (e.g. 31 February)', () => {
        const date = adapter.parse('31.02.2020');
        expect(date && !isNaN(date.getTime())).toBe(false);
    });

    it('rejects unparseable text as an Invalid Date, not null, matching NativeDateAdapter', () => {
        const date = adapter.parse('not a date');
        expect(date).toBeInstanceOf(Date);
        expect(date && isNaN(date.getTime())).toBe(true);
    });

    it('returns null for empty input', () => {
        expect(adapter.parse('')).toBeNull();
    });
});
