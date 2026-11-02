import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

export interface OnlineUser {
    userId: string;
    name: string;
    initials: string;
    page?: string;
    lastSeenAt: string;
}

// Lesbare Bezeichnung einer Admin-Seite (für den Tooltip "gerade auf ...").
export const pageLabel = (path: string | undefined): string => {
    if (!path) return 'unterwegs';
    if (path.startsWith('/registrations/ausfahrten/')) return 'Anmeldungen · Ausfahrt';
    if (path.startsWith('/registrations/kurse/')) return 'Anmeldungen · Kurs';
    const sections: [string, string][] = [
        ['/dashboard', 'Übersicht'],
        ['/registrations', 'Anmeldungen'],
        ['/card-management', 'Karten-Management'],
        ['/course-management', 'Kurs-Management'],
        ['/member-management', 'Vereinsverwaltung'],
        ['/analytics', 'Analytics'],
        ['/settings', 'Einstellungen'],
    ];
    return sections.find(([prefix]) => path.startsWith(prefix))?.[1] ?? 'unterwegs';
};

// Wer ist gerade im Admin unterwegs: Heartbeat jede Minute und bei Seitenwechsel (mit aktueller Seite),
// die Antwort enthält direkt die Liste der aktiven Admins (letzte 5 Minuten).
@Injectable({ providedIn: 'root' })
export class PresenceService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly apiUrl = environment.sckApiUrl;

    public readonly online = signal<OnlineUser[]>([]);
    public readonly me = signal<string | undefined>(undefined);

    constructor() {
        const destroyRef = inject(DestroyRef);
        effect(() => {
            if (this.auth.session()) this.beat();
            else this.online.set([]);
        });
        interval(60_000)
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe(() => this.beat());
        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntilDestroyed(destroyRef),
            )
            .subscribe(() => this.beat());
    }

    private beat(): void {
        if (!this.auth.session()) return;
        this.http
            .post<{ online: OnlineUser[]; me?: string }>(`${this.apiUrl}/presence`, { page: this.router.url })
            .subscribe({
                next: (res) => {
                    this.online.set(res.online);
                    this.me.set(res.me);
                },
                error: () => {},
            });
    }

    // "vor 2 Min." für den Tooltip.
    ago(iso: string, now: Date = new Date()): string {
        const minutes = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
        return minutes < 1 ? 'gerade eben' : `vor ${minutes} Min.`;
    }
}
