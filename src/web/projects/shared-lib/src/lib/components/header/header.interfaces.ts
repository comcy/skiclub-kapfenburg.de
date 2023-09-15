/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */

export enum NavigationItemTypes {
    InternalRoute = 'internal-routing',
    ExternalRoute = 'external-routing',
}


export interface NavigationItem {
    name: string;
    route: string
    routeType?: NavigationItemTypes;
}
