/*
 * @copyright Copyright (c) 2022 Carl Zeiss Industrielle Messtechnik GmbH - All Rights Reserved. ZEISS, ZEISS.com are trademarks of Carl Zeiss AG
 */

import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  first,
  map,
  subscribeOn,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GymInformationProviderServiceInterface } from '../../api/provider-services/gym-provider-service.interface';
import { GymInformation } from '../view-models';
import { GymInformationCoreServiceInterface } from './gym-information-core-service.interface';

@Injectable()
export class GymInformationCoreService
  implements GymInformationCoreServiceInterface
{
  public gymOffers$: BehaviorSubject<GymInformation[]> = new BehaviorSubject<
    GymInformation[]
  >([
    {
      title: 'TEST',
      appointment: 'TEST',
      description: 'TEST',
      contact: 'TEST',
    },
  ]);

  constructor(
    private gymInformationProviderService: GymInformationProviderServiceInterface
  ) {
    this.gymInformationProviderService
      .getGymOffers()
      .pipe(
        take(1),
        tap((t) => console.log('GYM-Offers: ', t))
      )
      .subscribe((offers) => {
        this.gymOffers$.next(offers);
      });
  }
}
