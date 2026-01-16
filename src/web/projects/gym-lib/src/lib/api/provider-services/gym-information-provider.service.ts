/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GymCourseInformation } from '../../domain';
import { GymInformationProviderServiceInterface } from './gym-provider-service.interface';

@Injectable()
export class GymInformationProviderService implements GymInformationProviderServiceInterface {
    getGymOffers(): Observable<GymCourseInformation[]> {
        // TODO: GET DATA FROM SOMEWHERE ELSE ---> WEB API ?
        return of<GymCourseInformation[]>([
            {
                name: 'Fitness Cocktail',
                time: 'Montags, 19:00 – 20:00 Uhr',
                location: 'Schulturnhalle Lauchheim',
                description: 'Fitness / Gymnastik für Jedermann - findet ganzjährig statt, ausser in den Ferien',
                contact: 'Katharina Sachs und Anna Klein, Tel: 07363/3492',
            },
            {
                name: 'Vitalgymnastik 50 Plus',
                time: 'Mittwochs, 19:00 – 20:00 Uhr',
                location: 'Altes Schulhaus Hülen',
                description:
                    '(gemischte Gruppe) Funktionelle Gymnastik zur Stabilisierung des Rückens, vielseitige körperliche Bewegungsübungen sowie Entspannung stärken die Leistungsfähigkeit.',
                contact: 'Monika Mayer, Tel: 07363/4432',
            },
            {
                name: 'Fitnessmix',
                time: 'Montags, 20.00 – 21.00 Uhr',
                location: 'Altes Schulhaus Hülen',
                description:
                    'Ein Mix aus Kräftigung und Ausdauer mit und ohne Handgeräte; Tiefenmuskel- und Koordinationstraining sowie Haltungsstabilisation',
                contact: 'Monika Mayer, Tel: 07363/4432',
            },
        ]);
    }
}
