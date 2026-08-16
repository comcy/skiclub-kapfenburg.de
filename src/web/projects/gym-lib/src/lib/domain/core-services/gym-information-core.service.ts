/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { GymInformationProviderServiceInterface } from '../../api/provider-services/gym-provider-service.interface';
import { GymCourseInformation } from '../models';
import { GymInformationCoreServiceInterface } from './gym-information-core-service.interface';
import { GYM_PILATES_COURSE_INFORMATION_WED, GYM_PILATES_COURSE_INFORMATION_THU } from 'projects/data/static';

@Injectable()
export class GymInformationCoreService implements GymInformationCoreServiceInterface {
    private gymInformationProviderService = inject(GymInformationProviderServiceInterface);

    public gymOffers$: BehaviorSubject<GymCourseInformation[]> = new BehaviorSubject<GymCourseInformation[]>([]);
    public pilatesOffers$: BehaviorSubject<GymCourseInformation[]> = new BehaviorSubject<GymCourseInformation[]>([
        GYM_PILATES_COURSE_INFORMATION_WED,
        GYM_PILATES_COURSE_INFORMATION_THU,
    ]);

    constructor() {
        this.gymInformationProviderService
            .getGymOffers()
            .pipe(
                take(1),
                tap((t) => console.log('GYM-Offers: ', t)),
            )
            .subscribe((offers) => {
                this.gymOffers$.next(offers);
            });
    }
}
