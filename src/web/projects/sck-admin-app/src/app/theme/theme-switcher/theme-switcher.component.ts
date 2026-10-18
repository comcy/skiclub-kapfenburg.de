import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../theme.service';

@Component({
    selector: 'app-theme-switcher',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
    templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent {
    public readonly themeService = inject(ThemeService);
}
