import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

export interface NewsSummary {
    // Basis ("neu seit"), ISO.
    since: string;
    trips: { total: number; byTile: Record<string, number> };
    courses: { total: number; byTile: Record<string, number> };
    // null = keine Berechtigung (members:manage).
    applications: number | null;
    // Pro Liste (tileId): wann dieser Admin sie zuletzt geöffnet hat.
    seen: Record<string, string>;
}

// Was seit dem letzten Login (bzw. "Alles gesehen") neu ist: Zaehler fuer Dashboard und Menue,
// plus isNew() fuer die Neu-Markierung einzelner Zeilen in den Listen.
@Injectable({ providedIn: 'root' })
export class NewsService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly apiUrl = environment.sckApiUrl;

    public readonly summary = signal<NewsSummary | null>(null);

    constructor() {
        // Neu laden, sobald eine Session da ist oder sich aendert (Login, "Alles gesehen").
        effect(() => {
            if (this.auth.session()) this.load();
            else this.summary.set(null);
        });
    }

    load(): void {
        this.http.get<NewsSummary>(`${this.apiUrl}/news`).subscribe({
            next: (summary) => this.summary.set(summary),
            error: () => this.summary.set(null),
        });
    }

    // Eintrag (created_at / timestamp, ISO) liegt nach der Basis des Admins - und, falls angegeben,
    // nach dem Zeitpunkt, an dem er die zugehörige Liste zuletzt geöffnet hatte.
    isNew(date: string | undefined | null, listSeenAt?: string | null): boolean {
        const since = this.auth.session()?.newsSince;
        return !!date && !!since && date > since && (!listSeenAt || date > listSeenAt);
    }

    // Wann der Admin die Liste (Ausfahrt/Kurs) zuletzt geöffnet hat, laut geladener Zusammenfassung.
    listSeenAt(tileId: string): string | undefined {
        return this.summary()?.seen?.[tileId];
    }

    // Liste wird geöffnet: ab jetzt gilt Älteres als gesehen (serverseitig pro Admin). Liefert den vorherigen
    // Zeitpunkt, damit die offene Liste ihre "Neu"-Badges für diesen Besuch noch zeigen kann.
    markListSeen(tileId: string): Observable<string | null> {
        return this.http.post<{ previousSeenAt: string | null }>(`${this.apiUrl}/news/tiles/${tileId}/seen`, {}).pipe(
            map((result) => result.previousSeenAt),
            tap(() => this.load()),
            catchError(() => of(null)),
        );
    }

    newInTile(kind: 'trips' | 'courses', tileId: string): number {
        return this.summary()?.[kind].byTile[tileId] ?? 0;
    }

    // "Alles gesehen": Basis auf jetzt, Session und Zaehler neu laden.
    markSeen(): void {
        this.http.post<{ newsSince: string }>(`${this.apiUrl}/news/seen`, {}).subscribe(() => {
            this.auth.checkSession().subscribe();
        });
    }
}
