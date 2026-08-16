import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission, Session } from '../domain/session';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    private readonly _session = signal<Session | null>(null);
    public readonly session = this._session.asReadonly();

    hasPermission(permission: Permission): boolean {
        return this._session()?.permissions.includes(permission) ?? false;
    }

    /** Loads the current session from the server-side cookie, if any. Never errors. */
    checkSession(): Observable<Session | null> {
        return this.http.get<Session>(`${this.apiUrl}/auth/session`, { withCredentials: true }).pipe(
            tap((session) => this._session.set(session)),
            catchError(() => {
                this._session.set(null);
                return of(null);
            }),
        );
    }

    requestMagicLink(email: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/auth/magic-link`, { email });
    }

    verifyMagicLink(token: string): Observable<Session> {
        return this.http
            .get<Session>(`${this.apiUrl}/auth/magic-link/verify`, {
                params: { token },
                withCredentials: true,
            })
            .pipe(tap((session) => this._session.set(session)));
    }

    googleLoginUrl(): string {
        return `${this.apiUrl}/auth/google`;
    }

    getInvite(token: string): Observable<{ email: string }> {
        return this.http.get<{ email: string }>(`${this.apiUrl}/invites/${token}`);
    }

    acceptInvite(token: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/invites/${token}/accept`, {});
    }

    logout(): Observable<void> {
        return this.http
            .post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
            .pipe(tap(() => this._session.set(null)));
    }
}
