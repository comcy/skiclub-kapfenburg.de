/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export const calculateAge = (
    birthday: Date | string | null | undefined,
    referenceDate: Date | string = new Date(),
): number => {
    if (!birthday) return NaN;

    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return NaN;

    const refDate = new Date(referenceDate);
    if (isNaN(refDate.getTime())) return NaN;

    let age = refDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = refDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
