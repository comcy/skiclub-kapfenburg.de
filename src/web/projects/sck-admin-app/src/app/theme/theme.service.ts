import { Injectable, signal } from '@angular/core';

export interface ThemeOption {
    id: string;
    name: string;
}

// 'violet' is the unscoped default theme defined directly on `html` in
// styles.scss (mat.define-theme()'s own default primary) - it has no
// .theme-violet class, see setTheme() below. The rest match the classes
// generated there from Angular Material's full set of M3 system palettes.
export const THEMES: ThemeOption[] = [
    { id: 'violet', name: 'Violett' },
    { id: 'red', name: 'Rot' },
    { id: 'green', name: 'Grün' },
    { id: 'blue', name: 'Blau' },
    { id: 'yellow', name: 'Gelb' },
    { id: 'cyan', name: 'Cyan' },
    { id: 'magenta', name: 'Magenta' },
    { id: 'orange', name: 'Orange' },
    { id: 'chartreuse', name: 'Chartreuse' },
    { id: 'spring-green', name: 'Frühlingsgrün' },
    { id: 'azure', name: 'Azur' },
    { id: 'rose', name: 'Rosé' },
];

const STORAGE_KEY = 'sck-admin-theme';
const DEFAULT_THEME = 'violet';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    public readonly themes = THEMES;
    public readonly current = signal(DEFAULT_THEME);

    constructor() {
        const stored = localStorage.getItem(STORAGE_KEY);
        const id = THEMES.some((theme) => theme.id === stored) ? (stored as string) : DEFAULT_THEME;
        this.applyTheme(id);
    }

    setTheme(id: string): void {
        localStorage.setItem(STORAGE_KEY, id);
        this.applyTheme(id);
    }

    private applyTheme(id: string): void {
        this.current.set(id);
        // classList is a live collection - snapshot it first, removing while
        // iterating would skip entries as indices shift.
        const existingThemeClasses = Array.from(document.body.classList).filter((className) =>
            className.startsWith('theme-'),
        );
        document.body.classList.remove(...existingThemeClasses);
        if (id !== DEFAULT_THEME) {
            document.body.classList.add(`theme-${id}`);
        }
    }
}
