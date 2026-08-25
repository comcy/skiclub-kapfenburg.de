import { Injectable, signal } from '@angular/core';

export interface ThemeOption {
    id: string;
    name: string;
}

// 'violet' is the unscoped default theme defined directly on `html` in
// styles.scss (mat.define-theme()'s own default primary) - it has no
// .theme-violet class, see applyColor() below. The rest match the
// .theme-{id} classes generated there - curated down to four palettes
// (see the theme-switcher plan), not the full set Angular Material ships.
export const THEMES: ThemeOption[] = [
    { id: 'violet', name: 'Violett' },
    { id: 'magenta', name: 'Magenta' },
    { id: 'cyan', name: 'Cyan' },
    { id: 'azure', name: 'Azur' },
];

const THEME_STORAGE_KEY = 'sck-admin-theme';
const DARK_STORAGE_KEY = 'sck-admin-dark-mode';
const DEFAULT_THEME = 'violet';
const DARK_CLASS = 'dark-theme';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    public readonly themes = THEMES;
    public readonly current = signal(DEFAULT_THEME);
    public readonly isDark = signal(false);

    constructor() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const id = THEMES.some((theme) => theme.id === storedTheme) ? (storedTheme as string) : DEFAULT_THEME;
        this.applyColor(id);
        this.applyDarkMode(localStorage.getItem(DARK_STORAGE_KEY) === 'true');
    }

    setTheme(id: string): void {
        localStorage.setItem(THEME_STORAGE_KEY, id);
        this.applyColor(id);
    }

    setDarkMode(isDark: boolean): void {
        localStorage.setItem(DARK_STORAGE_KEY, String(isDark));
        this.applyDarkMode(isDark);
    }

    private applyColor(id: string): void {
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

    private applyDarkMode(isDark: boolean): void {
        this.isDark.set(isDark);
        document.body.classList.toggle(DARK_CLASS, isDark);
    }
}
