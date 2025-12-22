/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export const calculateAge = (birthday: Date | string, referenceDate: Date = new Date()): number => {
    const birthDate = new Date(birthday);
    const refDate = new Date(referenceDate);

    let age = refDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = refDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
