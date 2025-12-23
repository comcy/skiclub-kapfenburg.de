import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiData, CourseRegistration } from '../../domain/course-registration';

@Injectable({
    providedIn: 'root',
})
export class CoursesRegistrationProviderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/api/ski-course-registrations';

    getRegistrations(): Observable<ApiData<CourseRegistration>> {
        return this.http.get<ApiData<CourseRegistration>>(this.apiUrl);
    }

    getRegistrationById(id: string): Observable<CourseRegistration> {
        return this.http.get<CourseRegistration>(`${this.apiUrl}/${id}`);
    }

    createRegistration(registration: CourseRegistration): Observable<CourseRegistration> {
        return this.http.post<CourseRegistration>(this.apiUrl, registration);
    }

    updateRegistration(id: string, registration: CourseRegistration): Observable<CourseRegistration> {
        return this.http.put<CourseRegistration>(`${this.apiUrl}/${id}`, registration);
    }

    deleteRegistration(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
