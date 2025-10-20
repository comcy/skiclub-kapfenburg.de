/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { GymInformationCoreServiceInterface } from '../../domain';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'lib-gym-general-information',
    templateUrl: './gym-general-information.component.html',
    styleUrls: ['./gym-general-information.component.scss'],
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
    ],
})
export class GymGeneralInformationComponent {
    @Input() gymState!: GymInformationCoreServiceInterface;
}
