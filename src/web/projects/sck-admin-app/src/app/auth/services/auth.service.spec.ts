import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('hasPermission returns false when no session is loaded', () => {
        expect(service.hasPermission('tiles:write')).toBeFalse();
    });

    it('checkSession populates the session signal with the permissions granted by the backend', () => {
        service.checkSession().subscribe();

        const req = httpMock.expectOne(`${environment.sckApiUrl}/auth/session`);
        expect(req.request.withCredentials).toBeTrue();
        req.flush({ email: 'member@example.com', permissions: ['tiles:write'] });

        expect(service.session()).toEqual({ email: 'member@example.com', permissions: ['tiles:write'] });
        expect(service.hasPermission('tiles:write')).toBeTrue();
        expect(service.hasPermission('sepa:read')).toBeFalse();
    });

    it('checkSession clears the session on a 401 instead of erroring', () => {
        let resolvedSession: unknown = 'not-set';
        service.checkSession().subscribe((session) => (resolvedSession = session));

        const req = httpMock.expectOne(`${environment.sckApiUrl}/auth/session`);
        req.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(resolvedSession).toBeNull();
        expect(service.session()).toBeNull();
    });

    it('logout clears the session', () => {
        service.checkSession().subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/session`).flush({
            email: 'member@example.com',
            permissions: ['boardings:write'],
        });
        expect(service.session()).not.toBeNull();

        service.logout().subscribe();
        httpMock.expectOne(`${environment.sckApiUrl}/auth/logout`).flush(null);

        expect(service.session()).toBeNull();
    });
});
