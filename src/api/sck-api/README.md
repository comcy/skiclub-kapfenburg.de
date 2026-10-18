# SCK API


## Build

```
npm run build
```

## Run
```
npm run start
```

## Umgebungsvariablen

Zusätzlich zu `SMTP_SERVER`, `SMTP_PORT`, `SENDER_MAIL`, `SENDER_PW` wird für
die feldweise Verschlüsselung der SEPA/IBAN-Daten (Mitgliedsanträge)
`SEPA_ENCRYPTION_KEY` benötigt: ein 32 Byte langer Hex-String (64 Zeichen),
z.B. erzeugt mit `openssl rand -hex 32`. Nicht einchecken, nur per `.env`
(lokal) bzw. Deployment-Secret (`SEPA_ENCRYPTION_KEY` in den GitHub-Secrets)
setzen.