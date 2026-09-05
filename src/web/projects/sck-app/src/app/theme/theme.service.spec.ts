/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        localStorage.clear();
        document.body.className = '';
        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);
    });

    afterEach(() => {
        localStorage.clear();
        document.body.className = '';
    });

    it('defaults to Blau, light mode, no body classes', () => {
        expect(service.current()).toBe('blau');
        expect(service.isDark()).toBe(false);
        expect(document.body.classList.contains('theme-gruen')).toBe(false);
        expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    it('setTheme adds a theme-<id> class for a non-default color and persists it', () => {
        service.setTheme('gruen');

        expect(service.current()).toBe('gruen');
        expect(document.body.classList.contains('theme-gruen')).toBe(true);
        expect(localStorage.getItem('sck-theme')).toBe('gruen');
    });

    it('setTheme back to the default color removes the class again', () => {
        service.setTheme('gruen');
        service.setTheme('blau');

        expect(document.body.classList.contains('theme-gruen')).toBe(false);
    });

    it('setDarkMode toggles the dark-theme class and persists it independently of color', () => {
        service.setTheme('gruen');
        service.setDarkMode(true);

        expect(document.body.classList.contains('theme-gruen')).toBe(true);
        expect(document.body.classList.contains('dark-theme')).toBe(true);
        expect(localStorage.getItem('sck-dark-mode')).toBe('true');
    });

    it('reads a previously stored theme/dark-mode choice on construction', () => {
        localStorage.setItem('sck-theme', 'gruen');
        localStorage.setItem('sck-dark-mode', 'true');

        // Fresh instance, as would happen on a real page reload.
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({});
        const freshService = TestBed.inject(ThemeService);

        expect(freshService.current()).toBe('gruen');
        expect(freshService.isDark()).toBe(true);
    });

    it('falls back to the default theme for an unknown stored value', () => {
        localStorage.setItem('sck-theme', 'not-a-real-theme');
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({});
        const freshService = TestBed.inject(ThemeService);

        expect(freshService.current()).toBe('blau');
    });
});
