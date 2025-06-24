/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ANGULAR_MATERIAL_MODULES } from '../../../components';
import { MaterialColor } from '../../enums';

@Component({
    selector: 'shared-lib-site-header',
    imports: [CommonModule, ANGULAR_MATERIAL_MODULES],
    templateUrl: './site-header.component.html',
    styleUrls: ['./site-header.component.css'],
    standalone: true,
})
export class SiteHeaderComponent {
    @Input() title = '';
    @Input() color: MaterialColor = 'primary'; // !!! default: 'primary' color !!!
}
