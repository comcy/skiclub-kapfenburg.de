# sck-admin-app

This project is an Angular application for the administration of the Skiclub Kapfenburg website.

## Initial Setup

This application was generated within the `skiclub-kapfenburg.de` workspace.

### Generation

The application was generated using the Angular CLI with the following command to ensure it runs non-interactively:

```bash
npx ng generate application sck-admin-app --standalone --style=scss --routing --no-ssr --no-interactive
```

### Zoneless Configuration

To improve performance and remove the dependency on `zone.js`, the application was configured to be "zoneless". This was achieved by modifying `src/app/app.config.ts` to use a `noop` NgZone provider.

The `providers` array in `appConfig` was updated from:
`provideZoneChangeDetection({ eventCoalescing: true })`
to:
`provideZoneChangeDetection({ ngZone: 'noop' })`

## Development

*(Further steps will be documented here)*
