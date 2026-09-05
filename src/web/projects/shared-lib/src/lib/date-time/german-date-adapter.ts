/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

// NativeDateAdapter.parse() ignores GERMAN_DATE_FORMATS entirely (it's a
// MatDateFormats.parse.dateInput format string, which only Moment/Luxon
// adapters honor) and falls back to the browser's native `Date.parse()` -
// which assumes MM.DD.YYYY for dot-separated dates, not DD.MM.YYYY. Typing
// "15.05.1985" (day 15, no such month) becomes an unparseable Invalid Date,
// and "10.03.2018" (10 March) silently becomes 3 October - the exact
// locale-parsing bug this project has already hit once before with slash
// dates (see CLAUDE.md). This adapter parses German-format text itself;
// everything else (calendar-picked Date objects, display formatting,
// calendar navigation) is unchanged, inherited from NativeDateAdapter.
@Injectable()
export class GermanDateAdapter extends NativeDateAdapter {
    private static readonly GERMAN_DATE_REGEX = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

    public override parse(value: unknown): Date | null {
        if (typeof value !== 'string' || !value.trim()) {
            return super.parse(value);
        }

        const match = GermanDateAdapter.GERMAN_DATE_REGEX.exec(value.trim());
        if (!match) {
            // Not a recognizable German date string - Invalid Date (not
            // null) so Material's own matDatepickerParse error still shows,
            // same contract NativeDateAdapter uses for unparseable input.
            return new Date(NaN);
        }

        const [, dayText, monthText, yearText] = match;
        const day = Number(dayText);
        const month = Number(monthText);
        const year = Number(yearText);

        // new Date(y, m, d) - local time, not new Date("y-m-d") - avoids the
        // UTC-midnight-shifts-a-day-back bug in timezones behind UTC (same
        // reasoning as member-editor.component.ts's parseIsoDate).
        const date = new Date(year, month - 1, day);
        const isRealCalendarDate =
            date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

        return isRealCalendarDate ? date : new Date(NaN);
    }
}
