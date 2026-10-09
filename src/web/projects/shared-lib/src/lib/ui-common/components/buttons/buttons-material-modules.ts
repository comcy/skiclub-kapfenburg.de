/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Split out of index.ts - base-button.component.ts needs this constant, but
// importing it from the barrel created a circular import (index.ts also
// re-exports mail/instagram/facebook/whatsapp-button, which all import
// BaseButtonComponent). This file has no button-component dependencies, so
// nothing cycles back through it.
export const SHARED_LIB_BUTTONS_NG_MAT_MODULES = [MatTooltipModule, MatIconModule, MatButtonModule, LayoutModule];
