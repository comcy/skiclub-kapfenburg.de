/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { GymInformationProviderServiceInterface } from '../../api/provider-services/gym-provider-service.interface';
import { GymInformation } from '../models';
import { GymInformationCoreServiceInterface } from './gym-information-core-service.interface';

@Injectable()
export class GymInformationCoreService implements GymInformationCoreServiceInterface {
    public gymOffers$: BehaviorSubject<GymInformation[]> = new BehaviorSubject<GymInformation[]>([
        {
            title: 'TEST',
            appointment: 'TEST',
            description: 'TEST',
            contact: 'TEST',
        },
    ]);

    constructor(private gymInformationProviderService: GymInformationProviderServiceInterface) {
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
