import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor
import { CoursesRegistrationBusinessService } from '../../services/business/courses-registration-business.service';
import { ApiData, CourseRegistration } from '../../domain/course-registration';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'lib-courses-registration-list',
    standalone: true,
    imports: [CommonModule], // Add CommonModule for *ngFor
    templateUrl: './courses-registration-list.component.html',
    styleUrl: './courses-registration-list.component.css',
})
export class CoursesRegistrationListComponent implements OnInit {
    private readonly businessService = inject(CoursesRegistrationBusinessService);
    public registrations$!: Observable<ApiData<CourseRegistration>>; // Using async pipe

    ngOnInit(): void {
        this.registrations$ = this.businessService
            .getRegistrations()
            .pipe(tap((regs) => console.log('Fetched registrations:', regs)));
    }
}
