import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';

const CALLBACK_TIMEOUT_MS = 15000;

/**
 * Landing page for both auth methods: the magic-link email points here with
 * ?token=... (still needs exchanging via POST /auth/magic-link/verify), and
 * the backend's Google OAuth callback redirects here with ?sessionToken=...
 * (already a live session, just needs storing).
 */
@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [MatProgressSpinnerModule],
    template: `<div class="callback-container"><mat-spinner diameter="40"></mat-spinner></div>`,
    styles: [
        `
            .callback-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 80vh;
            }
        `,
    ],
})
export class AuthCallbackComponent implements OnInit {
    private readonly auth = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    ngOnInit(): void {
        const params = this.route.snapshot.queryParamMap;
        const sessionToken = params.get('sessionToken');
        const magicLinkToken = params.get('token');

        const result$ = sessionToken
            ? this.auth.applySessionToken(sessionToken)
            : magicLinkToken
              ? this.auth.verifyMagicLink(magicLinkToken)
              : this.auth.checkSession();

        result$.pipe(timeout(CALLBACK_TIMEOUT_MS)).subscribe({
            next: (session) => {
                if (session) {
                    this.router.navigateByUrl('/event-management');
                } else {
                    this.router.navigate(['/login'], { queryParams: { error: 'auth-failed' } });
                }
            },
            error: () => this.router.navigate(['/login'], { queryParams: { error: 'auth-failed' } }),
        });
    }
}
