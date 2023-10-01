/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component } from '@angular/core';
import { GymInformationCoreServiceInterface } from 'projects/gym-lib/src/lib/domain';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
})
export class InformationComponent {
    constructor(public gymInformationCoreService: GymInformationCoreServiceInterface) {}
}
