import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('hasPermission returns false when no session is loaded', () => {
        expect(service.hasPermission('tiles:write')).toBeFalse();
    });

    it('checkSession resolves to null without a network call when no token is stored', () => {
        let resolvedSession: unknown = 'not-set';
        service.checkSession().subscribe((session) => (resolvedSession = session));

        httpMock.expectNone(`${environment.sckApiUrl}/auth/me`);
        expect(resolvedSession).toBeNull();
    });

    it('verifyMagicLink stores the session token and populates the session signal', () => {
        service.verifyMagicLink('magic-token').subscribe();

        const req = httpMock.expectOne(`${environment.sckApiUrl}/auth/magic-link/verify`);
        expect(req.request.body).toEqual({ token: 'magic-token' });
        req.flush({
            user: { id: '1', email: 'member@example.com', isSuperAdmin: false, permissions: ['tiles:write'] },
            sessionToken: 'session-token',
        });

        expect(service.session()).toEqual({
            email: 'member@example.com',
            isSuperAdmin: false,
            permissions: ['tiles:write'],
        });
        expect(service.getToken()).toBe('session-token');
    });

    it('checkSession attaches the stored token as a Bearer header and populates the session', () => {
        service.verifyMagicLink('magic-token').subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/magic-link/verify`).flush({
            user: { id: '1', email: 'member@example.com', isSuperAdmin: false, permissions: ['boardings:write'] },
            sessionToken: 'session-token',
        });

        service.checkSession().subscribe();
        const req = httpMock.expectOne(`${environment.sckApiUrl}/auth/me`);
        req.flush({ id: '1', email: 'member@example.com', isSuperAdmin: false, permissions: ['boardings:write'] });

        expect(service.session()).toEqual({
            email: 'member@example.com',
            isSuperAdmin: false,
            permissions: ['boardings:write'],
        });
        expect(service.hasPermission('boardings:write')).toBeTrue();
        expect(service.hasPermission('users:manage')).toBeFalse();
    });

    it('hasPermission is true for a super-admin regardless of granted permissions', () => {
        service.verifyMagicLink('magic-token').subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/magic-link/verify`).flush({
            user: { id: '1', email: 'admin@example.com', isSuperAdmin: true, permissions: [] },
            sessionToken: 'session-token',
        });

        expect(service.hasPermission('tiles:write')).toBeTrue();
    });

    it('checkSession clears the token and session on a 401 instead of erroring', () => {
        service.verifyMagicLink('magic-token').subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/magic-link/verify`).flush({
            user: { id: '1', email: 'member@example.com', isSuperAdmin: false, permissions: [] },
            sessionToken: 'session-token',
        });

        let resolvedSession: unknown = 'not-set';
        service.checkSession().subscribe((session) => (resolvedSession = session));
        httpMock
            .expectOne(`${environment.sckApiUrl}/auth/me`)
            .flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(resolvedSession).toBeNull();
        expect(service.session()).toBeNull();
        expect(service.getToken()).toBeNull();
    });

    it('logout clears the token and session without a network call', () => {
        service.verifyMagicLink('magic-token').subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/magic-link/verify`).flush({
            user: { id: '1', email: 'member@example.com', isSuperAdmin: false, permissions: [] },
            sessionToken: 'session-token',
        });
        expect(service.session()).not.toBeNull();

        service.logout();

        expect(service.session()).toBeNull();
        expect(service.getToken()).toBeNull();
    });
});
