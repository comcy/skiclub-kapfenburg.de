/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Lokale Datumsteile statt toISOString()/JSON - sonst rutscht ein Datepicker-Datum
// (lokal 00:00) in UTC auf den Vortag.
export const toIsoDate = (value: Date | string | null | undefined): string | undefined => {
    if (!value) return undefined;
    const d = new Date(value);
    if (isNaN(d.getTime())) return undefined;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
