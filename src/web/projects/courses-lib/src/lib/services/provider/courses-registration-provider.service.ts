import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseRegistration } from '../../domain/models/course-registration';
import { ApiData } from '../../domain/models';

@Injectable({
    providedIn: 'root',
})
export class CoursesRegistrationProviderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/api/ski-course-registrations';

    getRegistrations(sort?: string, filter?: string): Observable<ApiData<CourseRegistration>> {
        let params = new HttpParams();
        if (sort) {
            params = params.append('sort', sort);
        }
        if (filter) {
            params = params.append('filter', filter);
        }
        return this.http.get<ApiData<CourseRegistration>>(this.apiUrl, { params });
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
