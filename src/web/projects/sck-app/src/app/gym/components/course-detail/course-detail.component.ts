/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GymFeatureModule } from '@gym-lib';

@Component({
    selector: 'app-course-detail',
    templateUrl: './course-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [GymFeatureModule],
})
export class CourseDetailComponent {}
