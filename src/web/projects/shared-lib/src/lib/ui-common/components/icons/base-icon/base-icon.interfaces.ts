/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { InjectionToken } from '@angular/core';
import { MaterialColor } from '../../../enums';

export interface BaseIconProperties {
    iconName: string;
    iconPath: string;
    color: MaterialColor | undefined;
}

export const BASE_ICON_PROPERTIES = new InjectionToken<BaseIconProperties>('baseIconProperties');
