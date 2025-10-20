/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { InjectionToken } from '@angular/core';

export interface BaseIconProperties {
    iconName: string;
    iconPath: string;
}

export const BASE_ICON_PROPERTIES = new InjectionToken<BaseIconProperties>('baseIconProperties');
