import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseRegistration } from '../../domain/models/course-registration';
import { ApiData } from '../../domain/models';
import { environment } from 'projects/sck-app/src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CoursesRegistrationProviderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    getRegistrations(
        sort?: string,
        filter?: string,
        sportTypeFilter?: string,
    ): Observable<ApiData<CourseRegistration>> {
        let params = new HttpParams();
        if (sort) {
            params = params.append('sort', sort);
        }
        if (filter) {
            params = params.append('filter', filter);
        }
        if (sportTypeFilter) {
            params = params.append('sportTypeFilter', sportTypeFilter);
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
