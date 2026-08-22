/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface GymCoursePrice {
    member: string;
    nonMember: string;
}

/** Computable recurring session dates for a course, e.g. for calendar display. */
export interface GymCourseSchedule {
    /** 0 = Sonntag .. 6 = Samstag (Date.getDay() convention). */
    weekday: number;
    startDate: Date;
    endDate: Date;
    /** Concrete dates on which the course does not take place (holidays etc.). */
    excludedDates?: Date[];
}

export interface GymCourseInformation {
    name: string;
    description: string;
    details: string;
    time: string;
    location: string;
    contact: string;
    prices?: GymCoursePrice;
    date?: string;
    schedule?: GymCourseSchedule;
}
