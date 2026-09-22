# sck-admin-app produktiv deployen: einmalige Checkliste

`sck-admin-app` hat jetzt einen eigenen Produktiv-Deploy-Workflow
(`.github/workflows/sck-admin-app-build-deploy.yml`), analog zu
`sck-web-app-build-deploy.yml` — statisches Angular-Bundle per SCP auf
denselben Apache-Server wie `sck-app`/`sck-api`, kein Docker. Er ist bereits
push-getriggert (`push: branches: [master]`, wie sck-app), schlägt aber mit
einer klaren Fehlermeldung fehl, solange die folgenden Schritte noch nicht
erledigt sind — ein Push auf `master` vorher kann also nichts kaputt machen,
er deployt nur noch nicht.

## 1. Subdomain wählen + DNS-Eintrag

Empfehlung: `admin.skiclub-kapfenburg.de` (eigene Subdomain statt Unterpfad
— sauberere Trennung für SPA-Routing/Cookies). A- oder CNAME-Eintrag bei
eurem DNS-Provider auf dieselbe IP wie die bestehende Hauptdomain
(`SERVER_ADDRESS`-Secret) anlegen.

## 2. Apache-Vhost + TLS auf dem Server

Auf dem Produktivserver (gleicher Host wie sck-app/sck-api) einen neuen
Vhost für die Subdomain anlegen, `DocumentRoot` zeigt auf ein neues
Verzeichnis (z.B. `/var/www/html/sck-admin/`). TLS-Zertifikat ausstellen
(z.B. `certbot --apache -d admin.skiclub-kapfenburg.de`, wie vermutlich
schon für die Hauptdomain verwendet).

## 3. Zielverzeichnis anlegen

```bash
mkdir -p /var/www/html/sck-admin
chown <gleicher-user-wie-sck-app-verzeichnis> /var/www/html/sck-admin
```

## 4. GitHub Secrets anlegen

Repo → Settings → Secrets and variables → Actions:

- `SERVER_DIST_PATH_ADMIN` — der Pfad aus Schritt 3, z.B.
  `/var/www/html/sck-admin`. **Hinweis:** es gibt bereits ein unbenutztes
  Secret `SERVER_DIST_PATH_STAGE` — falls das genau für diesen Zweck
  angelegt wurde, könnt ihr es stattdessen umbenennen/wiederverwenden statt
  ein neues anzulegen (dann in `sck-admin-app-build-deploy.yml` den
  Secret-Namen entsprechend anpassen).
- `ADMIN_APP_URL` — die volle URL aus Schritt 1, z.B.
  `https://admin.skiclub-kapfenburg.de` (ohne abschließenden Slash — wird
  direkt vor Pfade wie `/auth/callback` gehängt, siehe
  `auth-controller.ts`).

Alle anderen benötigten Secrets (`SERVER_ADDRESS`, `SSH_USER`,
`SSH_PASSWORD`, `SCK_API_URL`, `TURNSTILE_SITE_KEY`) existieren bereits und
werden mit sck-app geteilt (dieselbe API-Instanz, derselbe öffentliche
Turnstile-Key).

## 5. sck-api neu deployen, damit ADMIN_APP_URL dort ankommt

`ADMIN_APP_URL` wird auch von `sck-api` gelesen (Basis-URL für die
Magic-Link-/Invite-Login-Mails, bisher nirgends in Produktion gesetzt,
fiel auf `http://localhost:4200` zurück — unschädlich, da es bisher keine
echte Admin-Instanz gab, die diese Links nutzt). Sobald das Secret gesetzt
ist, greift es beim nächsten erfolgreichen `SCK-API Deploy`-Lauf.

**Bekannter offener Punkt:** Die letzten 4 `SCK-API Deploy`-Läufe (zuletzt
Herbst 2025) sind alle fehlgeschlagen, jeweils nach nur ~15s — zu schnell,
um überhaupt bis zum Server-Setup zu kommen, spricht eher für ein
SSH-Verbindungs-/Auth-Problem (abgelaufenes `SSH_PASSWORD`? geänderte
`SERVER_ADDRESS`?) als für einen Code-Fehler. Die genauen Logs sind über
die GitHub-API nicht mehr abrufbar (>90 Tage alt). Vor Schritt 5 lohnt sich
ein manueller Blick: `gh run list --workflow="SCK-API Deploy"` und im
Zweifel ein Testlauf, bevor ihr euch auf den automatischen Deploy von
`ADMIN_APP_URL` verlasst. Separat davon behoben: eine falsche relative
Pfadangabe im systemd-Template-Schritt (`systemd/sck-api.service.template`
statt `src/api/sck-api/systemd/sck-api.service.template`) — könnte zur
Erklärung beitragen, ist aber angesichts der sehr kurzen Laufzeit der
fehlgeschlagenen Runs nicht sicher die alleinige Ursache.

## 6. Einmal testen

Nach einem Push auf `master`, der den neuen Workflow auslöst (oder direkt
danach manuell über Actions → „SCK-ADMIN Workflow" → „Run workflow", falls
ihr das vorher isoliert prüfen wollt): Subdomain im Browser öffnen, Login
über `scripts/dev-login.sh`-Analogon (echter Magic-Link aus einer Mail)
durchklicken, prüfen dass der Link in der Mail auf die echte Subdomain
zeigt (nicht mehr `localhost:4200`).

## Danach

Ab hier läuft es wie bei sck-app: jeder Push auf `master`, der
`sck-admin-app`/die geteilten Angular-Libraries betrifft, deployed
automatisch. Kein weiterer manueller Schritt nötig.
