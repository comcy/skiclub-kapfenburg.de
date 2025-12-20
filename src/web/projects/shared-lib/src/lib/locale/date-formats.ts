/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { MatDateFormats } from '@angular/material/core';

export const GERMAN_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD.MM.YYYY',
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'DD.MM.YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
