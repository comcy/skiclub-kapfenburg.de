# Branching & Worktree-Konventionen

## Branch-Namen

| Präfix | Zweck | Beispiel |
|---|---|---|
| `feat/<kebab-case>` | Neues Feature | `feat/adults-only-trip-pricing` |
| `fix/<kebab-case>` | Bugfix | `fix/family-head-account-holder` |
| `release/<datum>` | Release-Branch | `release/2026-08-20` |
| `dev/<name>` | Größere, länger laufende Entwicklungsarbeit (z.B. Dependency-Updates) | `dev/angular-update` |

- Kurz, beschreibend, kebab-case nach dem Präfix.
- Kein `feature/` (ausgeschrieben) mehr verwenden — `feat/` ist der aktuelle Standard.
- Kein `experimental/`-Präfix im Gebrauch.

## Repo-Struktur: Bare-Repo + Git-Worktrees

Standard-Layout für aktive Arbeit an mehreren Branches gleichzeitig, ohne
`git stash`/`checkout`-Hin-und-Her:

```
<projekt>/
├── .bare/              ← der eigentliche bare Clone
├── .git                ← Textdatei, Inhalt: "gitdir: ./.bare"
├── master/              ← Worktree für Branch "master"
├── release/2026-08-20/  ← Worktree für Branch "release/2026-08-20"
└── feat/
    ├── admin-app/        ← Worktree für Branch "feat/admin-app"
    └── ...
```

Verzeichnisname = Branch-Name (inkl. `/`-Namespace) → auf einen Blick
erkennbar, welcher Branch wo liegt.

### Neues Repo so einrichten

```bash
mkdir <projekt> && cd <projekt>
git clone --bare <remote-url> .bare
echo "gitdir: ./.bare" > .git

# pro Branch, der gebraucht wird:
git worktree add master master
git worktree add feat/admin-app feat/admin-app
```

### Worktree hinzufügen / entfernen

```bash
git worktree add <pfad> <branch>            # existierender Branch
git worktree add -b <neuer-branch> <pfad>   # neuer Branch ab HEAD

git worktree remove <pfad>                  # sauber entfernen
git worktree prune                          # falls Verzeichnis schon manuell gelöscht wurde
```

### Stolperfalle

Das Root-Verzeichnis selbst ist **kein** Worktree — nur `.bare/` + `.git`.
Dateien versehentlich direkt im Root anlegen landet außerhalb jedes
Branches und wird von keinem `git status` erfasst. Immer erst ins
passende Worktree-Verzeichnis wechseln.
