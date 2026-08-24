import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission, Session } from '../domain/session';

const TOKEN_KEY = 'sck-admin-session-token';

interface AuthUser {
    id: string;
    email: string;
    isSuperAdmin: boolean;
    permissions: Permission[];
}

interface LoginResult {
    user: AuthUser;
    sessionToken: string;
}

const toSession = (user: AuthUser): Session => ({
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    permissions: user.permissions,
});

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    private readonly _session = signal<Session | null>(null);
    public readonly session = this._session.asReadonly();

    hasPermission(permission: Permission): boolean {
        const session = this._session();
        return !!session && (session.isSuperAdmin || session.permissions.includes(permission));
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private clearToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }

    /** Loads the current session for the token held locally, if any. Never errors. */
    checkSession(): Observable<Session | null> {
        if (!this.getToken()) {
            this._session.set(null);
            return of(null);
        }

        return this.http.get<AuthUser>(`${this.apiUrl}/auth/me`).pipe(
            map(toSession),
            tap((session) => this._session.set(session)),
            catchError(() => {
                this.clearToken();
                this._session.set(null);
                return of(null);
            }),
        );
    }

    requestMagicLink(email: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/auth/magic-link`, { email });
    }

    verifyMagicLink(token: string): Observable<Session> {
        return this.http.post<LoginResult>(`${this.apiUrl}/auth/magic-link/verify`, { token }).pipe(
            tap((result) => this.setToken(result.sessionToken)),
            map((result) => toSession(result.user)),
            tap((session) => this._session.set(session)),
        );
    }

    /** Exchanges the Google OAuth callback's short-lived, single-use code for the real session token (never carried directly in the callback URL). */
    exchangeGoogleLoginCode(code: string): Observable<Session | null> {
        return this.http.post<{ sessionToken: string }>(`${this.apiUrl}/auth/google/exchange`, { code }).pipe(
            tap((result) => this.setToken(result.sessionToken)),
            switchMap(() => this.checkSession()),
        );
    }

    googleLoginUrl(): string {
        return `${this.apiUrl}/auth/google/start`;
    }

    getInvite(token: string): Observable<{ email: string }> {
        return this.http.get<{ email: string }>(`${this.apiUrl}/invites/${token}`);
    }

    acceptInvite(token: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/invites/accept`, { token });
    }

    /** Server holds no cookie to clear and there is no session-revocation endpoint yet — dropping the local token is all that's needed for now. */
    logout(): void {
        this.clearToken();
        this._session.set(null);
    }
}
