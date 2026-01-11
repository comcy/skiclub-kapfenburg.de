import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tile } from 'projects/shared-lib/src/lib/ui-common/models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TilesDataService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;
    private readonly endpoint = 'tiles';

    getTiles(): Observable<Tile[]> {
        return this.http
            .get<{ items: Tile[]; total: number }>(`${this.apiUrl}/${this.endpoint}`, { params: { limit: '1000' } })
            .pipe(
                map((response) =>
                    response.items.map((tile) => ({
                        ...tile,
                        expiration: new Date(tile.expiration),
                    })),
                ),
            );
    }
}
