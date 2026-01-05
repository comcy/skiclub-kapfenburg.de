/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Signal } from '@angular/core';

export enum NavigationItemTypes {
    InternalRoute = 'internal-routing',
    ExternalRoute = 'external-routing',
}

export interface NavigationItem {
    name: string;
    route: string;
    routeType?: NavigationItemTypes;
    icon?: string;
    color?: Signal<'primary' | 'accent' | 'warn'>;
}
