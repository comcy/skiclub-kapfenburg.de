/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component } from '@angular/core';
import { MATERIAL_COLOR } from '../../../enums';
import { InstagramIconComponent } from '../../icons/instagram-icon';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-instagram-button',
    imports: [BaseButtonComponent, InstagramIconComponent],
    templateUrl: './instagram-button.component.html',
    styleUrls: ['./instagram-button.component.scss'],
    standalone: true,
})
export class InstagramButtonComponent {
    readonly MATERIAL_COLOR = MATERIAL_COLOR;
    icon = 'instagram';
    link = 'https://www.instagram.com/skiclub_kapfenburg/';
    color = MATERIAL_COLOR.ACCENT;
    tooltip = 'Instagram öffnen';
    isSvgButton = true;
}
