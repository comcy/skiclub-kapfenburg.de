// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    sckApiUrl: 'http://localhost:3000/api',
    // Cloudflare's official "always passes" test site key - no real
    // Turnstile account needed for local dev (see turnstile-widget.component.ts).
    turnstileSiteKey: '1x00000000000000000000AA',
};
