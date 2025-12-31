import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TripRegistration } from '../../domain/models/trip-registration';
import { ApiData } from '../../domain/models/api-data';
import { environment } from 'projects/sck-app/src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TripsRegistrationProviderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    getRegistrations(
        eventId?: string,
        sort?: string,
        filter?: string,
        page?: number,
        limit?: number,
    ): Observable<ApiData<TripRegistration>> {
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

        const url = eventId ? `${this.apiUrl}/events/${eventId}/registrations` : `${this.apiUrl}/registrations`;
        return this.http.get<ApiData<TripRegistration>>(url, { params });
    }

    getRegistrationById(eventId: string, id: string): Observable<TripRegistration> {
        return this.http.get<TripRegistration>(`${this.apiUrl}/events/${eventId}/registrations/${id}`);
    }

    createRegistration(eventId: string, registration: TripRegistration): Observable<TripRegistration> {
        return this.http.post<TripRegistration>(`${this.apiUrl}/events/${eventId}/registrations`, registration);
    }

    updateRegistration(eventId: string, id: string, registration: TripRegistration): Observable<TripRegistration> {
        return this.http.put<TripRegistration>(`${this.apiUrl}/events/${eventId}/registrations/${id}`, registration);
    }

    deleteRegistration(eventId: string, id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/events/${eventId}/registrations/${id}`);
    }
}
