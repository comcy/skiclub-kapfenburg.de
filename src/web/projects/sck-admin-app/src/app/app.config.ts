import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {
    ApplicationConfig,
    LOCALE_ID,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';

// Without this the date pipe renders en-US ("3/1/05") across the admin UI.
registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideRouter(routes),
        provideAnimations(),
    ],
};
