/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ANGULAR_MATERIAL_MODULES } from '../../../components';
import { MaterialColor } from '../../enums';

@Component({
    selector: 'shared-lib-site-header',
    imports: [ANGULAR_MATERIAL_MODULES],
    templateUrl: './site-header.component.html',
    styleUrls: ['./site-header.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
})
export class SiteHeaderComponent {
    @Input() title = '';
    @Input() color: MaterialColor = 'primary'; // !!! default: 'primary' color !!!
}
