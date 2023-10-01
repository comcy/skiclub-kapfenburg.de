/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GymInformation } from '../models';

@Injectable()
export abstract class GymInformationCoreServiceInterface {
    public abstract gymOffers$: BehaviorSubject<GymInformation[]>;
}
