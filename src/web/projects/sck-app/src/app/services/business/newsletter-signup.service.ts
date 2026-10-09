/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Plain injectable, not the interface+DI-token pattern used for
// trips/courses forms - those exist to let a shared-lib component call an
// app-specific implementation across a package boundary. This dialog lives
// entirely inside sck-app, so there's no boundary to abstract over.
@Injectable({
    providedIn: 'root',
})
export class NewsletterSignupService {
    private readonly http = inject(HttpClient);

    signup(email: string, turnstileToken: string): Observable<void> {
        return this.http.post<void>(`${environment.sckApiUrl}/newsletter/signup`, { email, turnstileToken });
    }

    getTurnstileSiteKey(): string {
        return environment.turnstileSiteKey;
    }
}
