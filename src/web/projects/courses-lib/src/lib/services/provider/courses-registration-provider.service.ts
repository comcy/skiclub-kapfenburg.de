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
    private readonly endpoint = 'course-registrations';

    getRegistrations(
        sort?: string,
        filter?: string,
        page?: number,
        limit?: number,
        sportType?: string,
    ): Observable<ApiData<CourseRegistration>> {
        let params = new HttpParams();
        if (sort) {
            params = params.append('sort', sort);
        }
        if (filter) {
            params = params.append('filter', filter);
        }
        if (page) {
            params = params.append('page', page);
        }
        if (limit) {
            params = params.append('limit', limit);
        }
        if (sportType) {
            params = params.append('sportType', sportType);
        }

        return this.http.get<ApiData<CourseRegistration>>(`${this.apiUrl}/${this.endpoint}`, { params });
    }

    getRegistrationById(id: string): Observable<CourseRegistration> {
        return this.http.get<CourseRegistration>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }

    createRegistration(registration: CourseRegistration): Observable<CourseRegistration> {
        return this.http.post<CourseRegistration>(`${this.apiUrl}/${this.endpoint}`, registration);
    }

    updateRegistration(id: string, registration: CourseRegistration): Observable<CourseRegistration> {
        return this.http.put<CourseRegistration>(`${this.apiUrl}/${this.endpoint}/${id}`, registration);
    }

    deleteRegistration(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }
}
