import { BaseFormElements } from 'projects/shared-lib/src/lib/components';

export const TRIP_REGISTER_FORM_ELEMENTS: BaseFormElements[] = [
  {
    id: 'trip',
    label: 'Ausfahrt',
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
    id: 'amount',
    label: 'Anzahl der Personen',
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
  {
    id: 'boarding',
    label: 'Zustieg',
    validation: [{ type: 'required', message: 'is required' }],
    fullWidth: true,
    cols: 2,
  },
];
