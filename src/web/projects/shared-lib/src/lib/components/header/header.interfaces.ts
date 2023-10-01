/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

export enum NavigationItemTypes {
    InternalRoute = 'internal-routing',
    ExternalRoute = 'external-routing',
}

export interface NavigationItem {
    name: string;
    route: string;
    routeType?: NavigationItemTypes;
}
