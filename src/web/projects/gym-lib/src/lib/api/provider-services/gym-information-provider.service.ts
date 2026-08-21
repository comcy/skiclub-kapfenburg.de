/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { GYM_GENERAL_OFFERS } from 'projects/data/static';
import { Observable, of } from 'rxjs';
import { GymCourseInformation } from '../../domain';
import { GymInformationProviderServiceInterface } from './gym-provider-service.interface';

@Injectable()
export class GymInformationProviderService implements GymInformationProviderServiceInterface {
    getGymOffers(): Observable<GymCourseInformation[]> {
        return of<GymCourseInformation[]>(GYM_GENERAL_OFFERS);
    }
}
