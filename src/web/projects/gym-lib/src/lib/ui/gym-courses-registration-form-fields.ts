/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';

export const GYM_COURSES_REGISTRATION_FORM_ELEMENTS: BaseFormElements[] = [
    {
        id: 'sportType',
        label: 'Sportart',
        validation: [{ type: 'required', message: 'is required' }],
        fullWidth: true,
        cols: 2,
    },
    {
        id: 'firstName',
        label: 'Vorname',
        validation: [{ type: 'required', message: 'is required' }],
        cols: 1,
    },
    {
        id: 'lastName',
        label: 'Nachname',
        validation: [{ type: 'required', message: 'is required' }],
        cols: 1,
    },
    {
        id: 'email',
        label: 'E-Mail',
        validation: [
            { type: 'required', message: 'is required' },
            { type: 'email', message: 'E-Mail is required' },
        ],
        fullWidth: true,
        cols: 2,
    },
    {
        id: 'phone',
        label: 'Telefon',
        validation: [{ type: 'required', message: 'is required' }],
        fullWidth: true,
        cols: 2,
    },
    {
        id: 'age',
        label: 'Alter',
        validation: [{ type: 'required', message: 'is required' }],
        cols: 1,
    },
    {
        id: 'additionalText',
        label: 'Zusatz',
        validation: [{ type: 'required', message: 'is required' }],
        area: true,
        fullWidth: true,
        cols: 2,
    },
];
