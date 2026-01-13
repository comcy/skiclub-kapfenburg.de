/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymCourseInformation } from '../../domain';

@Injectable()
export abstract class GymInformationProviderServiceInterface {
    public abstract getGymOffers(): Observable<GymCourseInformation[]>;
}
