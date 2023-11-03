/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export const SHARED_LIB_BUTTONS_NG_MAT_MODULES = [MatTooltipModule, MatIconModule, MatButtonModule, LayoutModule];

export * from './mail-button';
export * from './instagram-button';
export * from './facebook-button';
export * from './whatsapp-button';
