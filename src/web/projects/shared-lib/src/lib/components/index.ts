/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

export const ANGULAR_MODULES = [CommonModule, RouterModule];

export const ANGULAR_MATERIAL_MODULES = [MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule];

export * from './footer';
export * from './header';
export * from './datenschutz';
export * from './impressum';
export * from './dialogs';
export * from './forms';
export * from './components.module';
