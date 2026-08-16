/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GymInformationCoreServiceInterface } from '../../domain';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'lib-gym-general-information',
    templateUrl: './gym-general-information.component.html',
    styleUrls: ['./gym-general-information.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AsyncPipe],
})
export class GymGeneralInformationComponent {
    @Input() gymState!: GymInformationCoreServiceInterface;
}
