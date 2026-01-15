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

export interface GymCoursesRegisterFormFields {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthday: string;
    additionalText: string;
    course: GymCourseInformation;
}
