import { Component } from '@angular/core';
import { MATERIAL_COLOR } from '../../../enums';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-facebook-button',
    standalone: true,
    imports: [BaseButtonComponent],
    templateUrl: './facebook-button.component.html',
    styleUrls: ['./facebook-button.component.scss'],
})
export class FacebookButtonComponent {
    readonly MATERIAL_COLOR = MATERIAL_COLOR;
    icon = 'facebook';
    link = 'https://www.facebook.com/SkiclubKapfenburg/';
    color = MATERIAL_COLOR.ACCENT;
    tooltip = 'Facebook öffnen';
    isSvgButton = false;
}
