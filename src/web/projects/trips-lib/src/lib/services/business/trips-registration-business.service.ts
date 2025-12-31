import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiData } from '../../domain/models/api-data';
import { TripRegistration } from '../../domain/models/trip-registration';
import { TripsRegistrationProviderService } from '../provider/trips-registration-provider.service';

@Injectable({
    providedIn: 'root',
})
export class TripsRegistrationBusinessService {
    private readonly provider = inject(TripsRegistrationProviderService);

    getRegistrations(
        eventId?: string,
        sort?: string,
        filter?: string,
        page?: number,
        limit?: number,
    ): Observable<ApiData<TripRegistration>> {
        // Business logic, mapping, etc. would go here.
        return this.provider.getRegistrations(eventId, sort, filter, page, limit);
    }

    getRegistrationById(eventId: string, id: string): Observable<TripRegistration> {
        return this.provider.getRegistrationById(eventId, id);
    }

    createRegistration(eventId: string, registration: TripRegistration): Observable<TripRegistration> {
        return this.provider.createRegistration(eventId, registration);
    }

    updateRegistration(eventId: string, id: string, registration: TripRegistration): Observable<TripRegistration> {
        return this.provider.updateRegistration(eventId, id, registration);
    }

    deleteRegistration(eventId: string, id: string): Observable<void> {
        return this.provider.deleteRegistration(eventId, id);
    }
}
