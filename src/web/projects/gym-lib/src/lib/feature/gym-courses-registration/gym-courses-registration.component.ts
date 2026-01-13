import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GYM_PILATES_COURSE_INFORMATION_THU, GYM_PILATES_COURSE_INFORMATION_WED } from 'projects/data/static';
import { GymCourseInformation } from '../../domain';
import { GymCoursesRegistrationFormComponent } from '../../ui/gym-courses-registration-form.component';

@Component({
    selector: 'lib-gym-courses-registration',
    imports: [GymCoursesRegistrationFormComponent],
    templateUrl: './gym-courses-registration.component.html',
    styleUrl: './gym-courses-registration.component.css',
    standalone: true,
})
export class GymCoursesRegistrationComponent {
    public email = new FormControl('', [Validators.required, Validators.email]);
    public gymCourses: GymCourseInformation[] = [
        GYM_PILATES_COURSE_INFORMATION_WED,
        GYM_PILATES_COURSE_INFORMATION_THU,
    ];

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }

        return this.email.hasError('email') ? 'Not a valid email' : '';
    }

    public onRegistrationFormSubmit(success: boolean): void {
        console.log('SUCCESS >>>> ', success);
        if (success) {
            console.log('SUCCESS clicked >>>> ', success);
        }
    }
}
