import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthCallbackComponent } from './auth-callback.component';

describe('AuthCallbackComponent', () => {
    let fixture: ComponentFixture<AuthCallbackComponent>;
    let authSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const setup = (queryParams: Record<string, string>) => {
        TestBed.configureTestingModule({
            imports: [AuthCallbackComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });
        fixture = TestBed.createComponent(AuthCallbackComponent);
        fixture.detectChanges();
    };

    beforeEach(() => {
        authSpy = jasmine.createSpyObj<AuthService>('AuthService', [
            'exchangeGoogleLoginCode',
            'verifyMagicLink',
            'checkSession',
        ]);
        routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    });

    it('exchanges a Google OAuth code (?code=...) rather than treating it as a magic-link/session token', () => {
        authSpy.exchangeGoogleLoginCode.and.returnValue(
            of({ email: 'x@example.com', isSuperAdmin: false, permissions: [] }),
        );

        setup({ code: 'one-time-code' });

        expect(authSpy.exchangeGoogleLoginCode).toHaveBeenCalledWith('one-time-code');
        expect(authSpy.verifyMagicLink).not.toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('verifies a magic-link token (?token=...) when there is no code', () => {
        authSpy.verifyMagicLink.and.returnValue(of({ email: 'x@example.com', isSuperAdmin: false, permissions: [] }));

        setup({ token: 'magic-token' });

        expect(authSpy.verifyMagicLink).toHaveBeenCalledWith('magic-token');
        expect(authSpy.exchangeGoogleLoginCode).not.toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('falls back to checkSession when neither a code nor a token is present', () => {
        authSpy.checkSession.and.returnValue(of(null));

        setup({});

        expect(authSpy.checkSession).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { error: 'auth-failed' } });
    });
});
