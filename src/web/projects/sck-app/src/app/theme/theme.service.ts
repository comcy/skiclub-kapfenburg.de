/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable, signal } from '@angular/core';

// Same mechanism as sck-admin-app's ThemeService (see its theme.service.ts)
// - color and dark-mode are two independent toggles, applied as classes on
// document.body and persisted in localStorage. Public site only needs the
// two colors #181 actually asks for (Blau/Grün), not admin's four - see
// styles.scss for the Sass side (native mat.$blue-palette/$green-palette
// instead of admin's hand-pasted token maps, otherwise identical result).
export interface ThemeOption {
    id: string;
    name: string;
}

export const THEMES: ThemeOption[] = [
    { id: 'blau', name: 'Blau' },
    { id: 'gruen', name: 'Grün' },
];

// Separate storage keys from sck-admin-app's (sck-admin-theme/-dark-mode) -
// both apps could in principle share an origin/subdomain family, keep them
// from colliding.
const THEME_STORAGE_KEY = 'sck-theme';
const DARK_STORAGE_KEY = 'sck-dark-mode';
const DEFAULT_THEME = 'blau';
const DARK_CLASS = 'dark-theme';

@Injectable({ providedIn: 'root' })
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
        const existingThemeClasses = Array.from(document.body.classList).filter((c) => c.startsWith('theme-'));
        document.body.classList.remove(...existingThemeClasses);
        if (id !== DEFAULT_THEME) document.body.classList.add(`theme-${id}`);
    }

    private applyDarkMode(isDark: boolean): void {
        this.isDark.set(isDark);
        document.body.classList.toggle(DARK_CLASS, isDark);
    }
}
