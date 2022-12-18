/*
 * @copyright Copyright (c) 2022 Carl Zeiss Industrielle Messtechnik GmbH - All Rights Reserved. ZEISS, ZEISS.com are trademarks of Carl Zeiss AG
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GymInformation } from '../view-models';

@Injectable()
export abstract class GymInformationCoreServiceInterface {
  public abstract gymOffers$: BehaviorSubject<GymInformation[]>;
}
