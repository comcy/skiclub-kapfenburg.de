import { Injectable, signal } from '@angular/core';

export interface ThemeOption {
    id: string;
    name: string;
}

// 'purple-amber' is the unscoped default theme defined directly on `html`
// in styles.scss - it has no .theme-purple-amber class, see applyColor()
// below. The rest (including the former default, Ocean) match the
// .theme-{id} classes generated there. Four hand-designed M3 token sets
// (see theme-tokens.scss / docs/sck-themes.md), not Angular Material's
// generic system palettes.
export const THEMES: ThemeOption[] = [
    { id: 'purple-amber', name: 'Purple & Amber' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'love', name: 'Love' },
    { id: 'snow', name: 'Snow' },
];

const THEME_STORAGE_KEY = 'sck-admin-theme';
const DARK_STORAGE_KEY = 'sck-admin-dark-mode';
const DEFAULT_THEME = 'purple-amber';
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
