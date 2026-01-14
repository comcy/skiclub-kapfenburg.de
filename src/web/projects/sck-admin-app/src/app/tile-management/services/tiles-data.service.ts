import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../domain/image';
import { PaginatedResponse } from '../domain/paginated-response';
import { Tile, TileCreationParams } from '../domain/tile';

@Injectable({
    providedIn: 'root',
})
export class TilesDataService {
    private readonly http = inject(HttpClient);
    public readonly apiUrl = 'http://localhost:3000/api';
    private readonly endpoint = 'tiles';

    getAbsoluteUrl(path: string | undefined): string {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const baseUrl = this.apiUrl.replace(/\/api$/, '');
        return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    getTiles(
        page: number = 1,
        limit: number = 100,
        sort?: string,
        direction?: 'asc' | 'desc',
        search?: string,
        type?: string,
        status?: string,
    ): Observable<PaginatedResponse<Tile>> {
        const params: Record<string, string> = {
            page: page.toString(),
            limit: limit.toString(),
        };

        if (sort) params['sort'] = sort;
        if (direction) params['direction'] = direction;
        if (search) params['search'] = search;
        if (type) params['type'] = type;
        if (status) params['status'] = status;

        return this.http.get<PaginatedResponse<Tile>>(`${this.apiUrl}/${this.endpoint}`, {
            params,
        });
    }

    getTile(id: string): Observable<Tile> {
        return this.http.get<Tile>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }

    createTile(tile: TileCreationParams): Observable<Tile> {
        return this.http.post<Tile>(`${this.apiUrl}/${this.endpoint}`, tile);
    }

    updateTile(id: string, tile: Tile): Observable<Tile> {
        return this.http.put<Tile>(`${this.apiUrl}/${this.endpoint}/${id}`, tile);
    }

    deleteTile(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
    }

    uploadImage(file: File): Observable<Image> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<Image>(`${this.apiUrl}/images/upload`, formData);
    }
}
