/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { MatIconModule } from '@angular/material/icon';
import { SckLogoIconComponent } from './sck-logo-icon';
import { InstagramIconComponent } from './instagram-icon/instagram-icon.component';

export const SHARED_LIB_ICONS_NG_MAT_MODULES = [MatIconModule];
export const SHARED_LIB_ICONS = [SckLogoIconComponent, InstagramIconComponent];

export * from './sck-logo-icon';
