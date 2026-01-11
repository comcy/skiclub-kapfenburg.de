import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GymCoursesRegistrationFormComponent } from '../../ui/gym-courses-registration-form.component';
import { GymCourse } from '../../domain';

@Component({
    selector: 'lib-gym-courses-registration',
    imports: [GymCoursesRegistrationFormComponent],
    templateUrl: './gym-courses-registration.component.html',
    styleUrl: './gym-courses-registration.component.css',
    standalone: true,
})
export class GymCoursesRegistrationComponent {
    public email = new FormControl('', [Validators.required, Validators.email]);
    public gymCourses: GymCourse[] = [
        {
            name: 'Pilates (Mittwoch)',
            date: '14. Januar 2026 - 25. März 2026',
        },
        {
            name: 'Pilates (Donnerstag)',
            date: '29. Januar 2026 - 26. März 2026',
        },
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
