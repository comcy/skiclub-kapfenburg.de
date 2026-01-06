import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiData, CourseRegistration } from '../../domain/models';
import { CoursesRegistrationProviderService } from '../provider/courses-registration-provider.service';

@Injectable({
    providedIn: 'root',
})
export class CoursesRegistrationBusinessService {
    private readonly provider = inject(CoursesRegistrationProviderService);

    getRegistrations(
        sort?: string,
        filter?: string,
        page?: number,
        limit?: number,
        sportType?: string,
    ): Observable<ApiData<CourseRegistration>> {
        // Business logic, mapping, etc. would go here.
        return this.provider.getRegistrations(sort, filter, page, limit, sportType);
    }

    getRegistrationById(id: string): Observable<CourseRegistration> {
        return this.provider.getRegistrationById(id);
    }

    createRegistration(registration: CourseRegistration): Observable<CourseRegistration> {
        return this.provider.createRegistration(registration);
    }

    updateRegistration(id: string, registration: CourseRegistration): Observable<CourseRegistration> {
        return this.provider.updateRegistration(id, registration);
    }

    deleteRegistration(id: string): Observable<void> {
        return this.provider.deleteRegistration(id);
    }
}
