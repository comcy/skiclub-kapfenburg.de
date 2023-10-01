/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GymInformation } from '../../domain';
import { GymInformationProviderServiceInterface } from './gym-provider-service.interface';

@Injectable()
export class GymInformationProviderService implements GymInformationProviderServiceInterface {
    getGymOffers(): Observable<GymInformation[]> {
        // TODO: GET DATA FROM SOMEWHERE ELSE ---> WEB API ?
        return of<GymInformation[]>([
            {
                title: 'Fitness Cocktail',
                appointment: 'Montags, 19:00 – 20:00 Uhr - Schulturnhalle Lauchheim',
                description: 'Fitness / Gymnastik für Jedermann - findet ganzjährig statt, ausser in den Ferien',
                contact: 'Katharina Sachs und Anna Klein, Tel: 07363/3492',
            },
            {
                title: 'Vitalgymnastik 50 Plus',
                appointment: 'Montags, 19.00 – 20.00 Uhr - Altes Schulhaus Hülen',
                description:
                    '(gemischte Gruppe) Funktionelle Gymnastik zur Stabilisierung des Rückens, vielseitige körperliche Bewegungsübungen sowie Entspannung stärken die Leistungsfähigkeit.',
                contact: 'Monika Mayer, Tel: 07363/4432',
            },
            {
                title: 'Fitnessmix',
                appointment: 'Montags, 20.00 – 21.00 Uhr - Altes Schulhaus Hülen',
                description:
                    'Ein Mix aus Kräftigung und Ausdauer mit und ohne Handgeräte; Tiefenmuskel- und Koordinationstraining sowie Haltungsstabilisation',
                contact: 'Monika Mayer, Tel: 07363/4432',
            },
        ]);
    }
}
