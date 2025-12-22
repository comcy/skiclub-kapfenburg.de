/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export const formatDateTime = (date: string | Date, locale: string = 'de-DE'): string => {
    if (!date) {
        return '';
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return '';
    }

    const hasTime = typeof date === 'string' && (date.includes('T') || date.includes(':'));

    const options: Intl.DateTimeFormatOptions = hasTime
        ? {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          }
        : {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          };

    return new Intl.DateTimeFormat(locale, options).format(d);
};
