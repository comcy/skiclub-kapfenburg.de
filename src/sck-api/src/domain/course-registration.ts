/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { GymCourseInformation } from './gym-course-information';

export interface CourseRegisterFormFields {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthday: string;
    additionalText: string;
    course: GymCourseInformation;
    price?: number;

    // Legacy fields (optional)
    sportType?: string;
    age?: string;
    level?: string;
}

export enum SportType {
    Alpin = 'Alpin',
    Snowboard = 'Snowboard',
}
