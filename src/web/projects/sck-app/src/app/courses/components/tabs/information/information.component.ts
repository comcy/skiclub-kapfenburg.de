/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';

@Component({
    standalone: true,
    selector: 'app-information',
    templateUrl: './information.component.html',
    imports: [CommonModule, CoursesFeatureModule, CoursesUiModule],
})
export class InformationComponent {}
