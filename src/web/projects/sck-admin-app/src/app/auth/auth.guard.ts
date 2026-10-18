import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

/** Redirects to /login unless a session cookie already resolves to a user. */
export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.session()) return true;

    return auth.checkSession().pipe(map((session) => (session ? true : router.parseUrl('/login'))));
};
