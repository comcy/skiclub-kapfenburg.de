/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface CourseRegisterFormFields {
    id?: string;
    firstName: string;
    lastName: string;
    sportType: string;
    email: string;
    phone: string;
    age: string;
    additionalText: string;
    level: string;
}

export enum SportType {
    Alpin = 'Alpin',
    Snowboard = 'Snowboard',
}
