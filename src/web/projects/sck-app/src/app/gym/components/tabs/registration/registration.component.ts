import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GymCoursesRegistrationComponent } from 'projects/gym-lib/src/lib/feature/gym-courses-registration/gym-courses-registration.component';

@Component({
    selector: 'app-registration',
    imports: [CommonModule, RouterModule, GymCoursesRegistrationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss',
    standalone: true,
})
export class RegistrationComponent {}
