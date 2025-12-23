/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface ApiData<T> {
    data: T[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

export interface CourseRegistration {
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
