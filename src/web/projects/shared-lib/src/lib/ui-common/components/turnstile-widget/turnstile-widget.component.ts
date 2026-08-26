/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    inject,
    ChangeDetectionStrategy,
} from '@angular/core';

// Emitted instead of a real Cloudflare token when no siteKey is configured
// yet (see docker-compose.yml/.env.example) - the backend fails open in the
// same situation (see sck-api's turnstile-middleware.ts), so the form
// shouldn't stay stuck waiting for a widget that will never render.
export const TURNSTILE_NOT_CONFIGURED = 'turnstile-not-configured';

interface TurnstileRenderOptions {
    sitekey: string;
    callback: (token: string) => void;
    'expired-callback'?: () => void;
    'error-callback'?: () => void;
}

interface TurnstileApi {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    remove: (widgetId: string) => void;
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const getTurnstileApi = (): TurnstileApi | undefined => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

let scriptLoadPromise: Promise<void> | undefined;
const loadScript = (): Promise<void> => {
    if (getTurnstileApi()) return Promise.resolve();
    scriptLoadPromise ??= new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Turnstile-Script konnte nicht geladen werden.'));
        document.head.appendChild(script);
    });
    return scriptLoadPromise;
};

// Thin wrapper around Cloudflare Turnstile's vanilla-JS widget - injects the
// script on first use (no index.html changes needed in either app) and
// re-emits its callbacks as a plain Angular output. Reused across every
// public form (membership, trips, courses) and the admin login.
@Component({
    selector: 'shared-lib-turnstile-widget',
    standalone: true,
    template: `<div #container></div>`,
    // Cloudflare renders a fixed-width iframe into #container in normal
    // flow - without this, the host (a custom element, inline by default)
    // just shrink-wraps that iframe and the widget ends up hanging off the
    // start edge of whatever form row it sits in instead of lining up with
    // the full-width fields/buttons around it. flex+justify-content is used
    // rather than text-align/margin:auto since it centers the child
    // regardless of whether Cloudflare's injected markup is inline or block.
    styles: [
        `
            :host {
                display: flex;
                justify-content: center;
                width: 100%;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class TurnstileWidgetComponent implements OnInit, OnDestroy {
    @Input({ required: true }) siteKey!: string;
    @Output() tokenChange = new EventEmitter<string | null>();

    @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;

    private readonly ngZone = inject(NgZone);
    private widgetId: string | undefined;

    async ngOnInit(): Promise<void> {
        if (!this.siteKey) {
            this.tokenChange.emit(TURNSTILE_NOT_CONFIGURED);
            return;
        }

        try {
            await loadScript();
        } catch (error) {
            console.error(error);
            this.tokenChange.emit(null);
            return;
        }

        this.widgetId = getTurnstileApi()?.render(this.containerRef.nativeElement, {
            sitekey: this.siteKey,
            callback: (token) => this.ngZone.run(() => this.tokenChange.emit(token)),
            'expired-callback': () => this.ngZone.run(() => this.tokenChange.emit(null)),
            'error-callback': () => this.ngZone.run(() => this.tokenChange.emit(null)),
        });
    }

    ngOnDestroy(): void {
        if (this.widgetId) {
            getTurnstileApi()?.remove(this.widgetId);
        }
    }
}
