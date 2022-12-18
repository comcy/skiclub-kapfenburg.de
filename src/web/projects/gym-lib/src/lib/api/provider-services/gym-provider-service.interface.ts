/*
 * @copyright Copyright (c) 2022 Carl Zeiss Industrielle Messtechnik GmbH - All Rights Reserved. ZEISS, ZEISS.com are trademarks of Carl Zeiss AG
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymInformation } from '../../domain';

@Injectable()
export abstract class GymInformationProviderServiceInterface {
  public abstract getGymOffers(): Observable<GymInformation[]>;
}
