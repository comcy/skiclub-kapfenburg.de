# Skiclub Kapfenburg e.V.

[![SCK-WEB Workflow](https://github.com/comcy/skiclub-kapfenburg.de/actions/workflows/sck-web-app-build-deploy.yml/badge.svg)](https://github.com/comcy/skiclub-kapfenburg.de/actions/workflows/sck-web-app-build-deploy.yml)

This project represents the web page of "Skiclub Kapfenburg e.V." a society to promote and support winter sports. It's residence is in the south of Germany, Baden-Württemberg within small district called "Ostalb". 

The website is based on the Angular framework and is written as standalone client application.
Logos and images are owned by the society "Skiclub Kapfenburg e.V." - The usage of any of these files is prohibited in any way! 

---

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Testing

`bash scripts/verify.sh` is the one entrypoint that runs build + lint + tests for every package (add `--filter web` or `--filter sck-api` to scope it to one) — the same thing CI runs, so it's the fastest way to know if a change is green before pushing.

### Unit tests

- **Web** (`src/web`): `pnpm --filter web test` — Angular/Karma, headless Chrome.
- **sck-api** (`src/api/sck-api`): `pnpm --filter sck-api test` — Jest.

### End-to-end tests

Playwright, living in `e2e/`, driving a real browser against the app. One-time setup: `pnpm --filter e2e exec playwright install --with-deps chromium`. Then `pnpm --filter e2e test` — it starts the dev server itself, no need to run `ng serve` separately first.

### Test deployment (Docker)

Beyond web/e2e/api unit tests, the repo also has a containerized deployment you can run for manual/exploratory testing, separate from the production systemd/Apache setup: `docker-compose.yml` at the repo root builds `web` (nginx), `sck-api` (Node) and `admin` (nginx, the admin app) images and runs them together with a persistent data volume. Try it locally with `docker compose up` (after copying `.env.example` to `.env` and filling in the values).

To stand up a full instance on a Proxmox homeserver LXC, run this on the Proxmox host — no cloning required, prompts for everything it needs, safe to re-run (existing LXC/data/`.env` values are reused, not wiped):

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/comcy/skiclub-kapfenburg.de/master/infrastructure/proxmox/setup-test-system.sh)"
```

See [`infrastructure/TEST_DEPLOYMENT.md`](infrastructure/TEST_DEPLOYMENT.md) for the complete walkthrough, including where SMTP/sheet-URL/API-URL/admin-app configuration lives and how to change it after deploying.

## LICENSE

MIT License

Copyright (c) 2019 - 2026 Christian Silfang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
