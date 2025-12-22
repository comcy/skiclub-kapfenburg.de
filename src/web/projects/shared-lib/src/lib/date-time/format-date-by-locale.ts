/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export const formatDateByLocale = (date: string | Date, localeFormatString: string = 'de-DE'): string => {
    if (!date) {
        return '';
    }

    return new Date(date).toLocaleDateString(localeFormatString);
};
