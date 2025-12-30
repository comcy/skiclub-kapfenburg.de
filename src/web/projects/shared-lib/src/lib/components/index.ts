/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

export const ANGULAR_MODULES = [CommonModule, RouterModule];
export const ANGULAR_MATERIAL_MODULES = [
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
];

export * from './components.module';
export * from './footer';
export * from './header';
export * from './datenschutz';
export * from './impressum';
export * from './dialogs';
export * from './forms';
export * from './error-pages/not-found/not-found.component';
