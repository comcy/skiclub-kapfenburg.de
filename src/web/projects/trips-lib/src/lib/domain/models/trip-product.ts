/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { AgeCategory } from './trip-base';

export interface BusLiftBase {
    kind: 'busLift';
    ageCategory: AgeCategory;
}

export interface BusOnlyBase {
    kind: 'busOnly';
}

export type BaseProduct = BusLiftBase | BusOnlyBase;
