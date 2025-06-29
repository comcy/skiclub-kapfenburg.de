/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface Appointment {
    tag: string;
    zeitblock: 'vormittag' | 'nachmittag';
    titel: string;
    uhrzeit: string;
    ort: string;
}
