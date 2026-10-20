import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

export interface NewsSummary {
    // Basis ("neu seit"), ISO.
    since: string;
    trips: { total: number; byTile: Record<string, number> };
    courses: { total: number; byTile: Record<string, number> };
    // null = keine Berechtigung (members:manage).
    applications: number | null;
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

    // Eintrag (created_at / timestamp, ISO) liegt nach der Basis des Admins.
    isNew(date: string | undefined | null): boolean {
        const since = this.auth.session()?.newsSince;
        return !!date && !!since && date > since;
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
