import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Boarding, BoardingCreationParams } from '../domain/boarding';
import { PaginatedResponse } from '../../tile-management/domain/paginated-response';

@Injectable({
    providedIn: 'root',
})
export class BoardingsDataService {
    private readonly http = inject(HttpClient);
    // Using absolute path assuming same host for now, or use environment if available in admin app.
    // Using localhost:3000 as per previous service implementations.
    private readonly apiUrl = 'http://localhost:3000/api';
    private readonly endpoint = 'boardings';

    getBoardings(page: number = 1, limit: number = 100): Observable<PaginatedResponse<Boarding>> {
        return this.http.get<PaginatedResponse<Boarding>>(`${this.apiUrl}/${this.endpoint}`, {
            params: {
                page: page.toString(),
                limit: limit.toString(),
            },
        });
    }

    getBoarding(id: string): Observable<Boarding> {
        return this.http.get<Boarding>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }

    createBoarding(params: BoardingCreationParams): Observable<Boarding> {
        return this.http.post<Boarding>(`${this.apiUrl}/${this.endpoint}`, params);
    }

    updateBoarding(id: string, params: BoardingCreationParams): Observable<Boarding> {
        return this.http.put<Boarding>(`${this.apiUrl}/${this.endpoint}/${id}`, params);
    }

    deleteBoarding(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }
}
