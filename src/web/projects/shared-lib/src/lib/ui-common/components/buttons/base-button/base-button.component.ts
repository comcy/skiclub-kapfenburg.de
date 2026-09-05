import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '../buttons-material-modules';
import { MATERIAL_COLOR, MaterialColor } from '../../../enums';

@Component({
    selector: 'shared-lib-base-button',
    standalone: true,
    imports: [SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './base-button.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./base-button.component.scss'],
})
export class BaseButtonComponent {
    @Input({ required: true }) icon!: string;
    @Input({ required: true }) link!: string;
    @Input() tooltip = '';
    @Input() color?: MaterialColor = MATERIAL_COLOR.PRIMARY;
    @Input() isSvg = false;

    openLink(): void {
        window.open(this.link, '_blank');
    }
}
