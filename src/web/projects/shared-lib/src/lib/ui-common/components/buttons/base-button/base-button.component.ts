import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialColor } from '../../../enums';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';

@Component({
    selector: 'shared-lib-base-button',
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './base-button.component.html',
    styleUrls: ['./base-button.component.scss'],
})
export class BaseButtonComponent {
    @Input() link: string | undefined;
    @Input() buttonName: string | undefined;
    @Input() color: MaterialColor | undefined;
    @Input() tooltip: string;
    @Input() isSvgButton: boolean;

    constructor() {
        this.tooltip = '';
        this.isSvgButton = false;
    }

    public openLink(): void {
        if (this.link) {
            window.open(this.link, '_blank');
        }
    }
}
