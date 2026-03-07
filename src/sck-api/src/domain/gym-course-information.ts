/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface GymCoursePrice {
    member: string;
    nonMember: string;
}

export interface GymCourseInformation {
    name: string;
    description: string;
    time: string;
    location: string;
    contact: string;
    prices?: GymCoursePrice;
    date?: string;
}
